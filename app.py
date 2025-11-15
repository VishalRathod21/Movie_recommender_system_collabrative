# app.py
# Flask backend for movie recommender

import os
from flask import Flask, jsonify, request, send_file, render_template, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__, static_folder='static', template_folder='static')
CORS(app)

MODEL_FILE = 'movie_recommender_v1.pkl'

# -------------------------
# Utility: build or load model
# -------------------------

def build_and_save_model(movies_csv, ratings_csv, min_movie_votes=10, min_user_votes=50, save_path=MODEL_FILE):
    """
    Build the recommender from CSVs and save a joblib compressed file with required objects.
    """
    movies = pd.read_csv(movies_csv)
    ratings = pd.read_csv(ratings_csv)

    # Pivot to movie-user matrix
    final_dataset = ratings.pivot(index='movieId', columns='userId', values='rating')
    final_dataset.fillna(0, inplace=True)

    # Remove movies with very few votes and users with very few ratings
    no_user_voted = ratings.groupby('movieId')['rating'].agg('count')
    no_movies_voted = ratings.groupby('userId')['rating'].agg('count')

    final_dataset = final_dataset.loc[no_user_voted[no_user_voted > min_movie_votes].index, :]
    final_dataset = final_dataset.loc[:, no_movies_voted[no_movies_voted > min_user_votes].index]

    # Build sparse matrix
    csr_data = csr_matrix(final_dataset.values)

    # Fit KNN
    knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
    knn.fit(csr_data)

    # Reset index in final_dataset so we have movieId as a column
    final_dataset = final_dataset.reset_index()

    to_save = {
        'knn': knn,
        'final_dataset': final_dataset,
        'movies': movies,
        'csr_data': csr_data
    }

    joblib.dump(to_save, save_path, compress=3)
    print(f"Saved model to {save_path}")
    return save_path


def load_model(path=MODEL_FILE):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")
    data = joblib.load(path)
    return data


# Attempt to load model at startup if present
MODEL = None
try:
    MODEL = load_model(MODEL_FILE)
    print("Loaded model from disk.")
except Exception as e:
    print("Model not found at startup. Please visit /api/build to create it or run build_and_save_model manually.")
    MODEL = None


# -------------------------
# API endpoints
# -------------------------

@app.route('/')
def index():
    # Serve SPA
    return app.send_static_file('index.html')


@app.route('/api/build', methods=['POST'])
def api_build_model():
    """
    POST JSON body expects: {"movies_csv": "path_or_url", "ratings_csv": "path_or_url"}
    This endpoint builds the model and saves it to disk. Use for local paths or accessible URLs.
    """
    data = request.get_json() or {}
    movies_csv = data.get('movies_csv')
    ratings_csv = data.get('ratings_csv')
    min_movie_votes = int(data.get('min_movie_votes', 10))
    min_user_votes = int(data.get('min_user_votes', 50))

    if not (movies_csv and ratings_csv):
        return jsonify({'error': 'Provide movies_csv and ratings_csv (local path or URL)'}), 400

    try:
        saved = build_and_save_model(movies_csv, ratings_csv, min_movie_votes, min_user_votes)
        global MODEL
        MODEL = load_model(saved)
        return jsonify({'ok': True, 'saved': saved})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/recommend')
def api_recommend():
    """
    Query params:
      q = movie name to search (partial allowed)
      n = number of recommendations (default 10)
    Example: /api/recommend?q=Avatar&n=5
    """
    if MODEL is None:
        return jsonify({'error': 'Model not loaded. Build it via /api/build or place the pkl next to app.'}), 400

    q = request.args.get('q', '')
    n = int(request.args.get('n', 10))

    if not q:
        return jsonify({'error': 'q (movie search string) required'}), 400

    movies = MODEL['movies']
    final_dataset = MODEL['final_dataset']
    knn = MODEL['knn']
    csr_data = MODEL['csr_data']

    # Case-insensitive partial match
    movie_list = movies[movies['title'].str.contains(q, case=False, na=False)]
    if movie_list.empty:
        return jsonify({'error': 'Movie not found'}), 404

    # pick the first match
    movie_id = int(movie_list.iloc[0]['movieId'])

    try:
        movie_idx = int(final_dataset[final_dataset['movieId'] == movie_id].index[0])
    except Exception:
        return jsonify({'error': 'Movie found in movies.csv but not in filtered training dataset (maybe it had few ratings).'}), 404

    # We ask knn for n+1 because the first neighbor will be the movie itself (distance 0)
    k = min(knn.n_neighbors, n + 1)
    distance, indices = knn.kneighbors(csr_data[movie_idx], n_neighbors=k)

    recs = []
    # indices and distance are 2D (1 x k)
    for idx, dist in zip(indices.squeeze().tolist(), distance.squeeze().tolist()):
        if idx == movie_idx:
            continue
        m_id = int(final_dataset.iloc[idx]['movieId'])
        title = movies[movies['movieId'] == m_id]['title'].values
        title = title[0] if len(title) > 0 else 'Unknown Title'
        recs.append({'movieId': m_id, 'title': title, 'distance': float(dist)})
        if len(recs) >= n:
            break

    return jsonify({'query': q, 'results': recs})


@app.route('/api/download')
def api_download_model():
    """
    Returns the saved model file for download if present.
    """
    if not os.path.exists(MODEL_FILE):
        return jsonify({'error': 'Model file not found on server.'}), 404
    # send as attachment
    return send_file(MODEL_FILE, as_attachment=True)


# Static file serving (already handled by Flask's static_folder) but add explicit route if needed
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)


if __name__ == '__main__':
    # For local testing; in production use gunicorn/uvicorn
    app.run(host='0.0.0.0', port=5000, debug=True)
