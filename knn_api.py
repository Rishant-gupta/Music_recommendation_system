#    uvicorn cosine_api_knn:app --reload
# API will be at http://127.0.0.1:8000

import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from sklearn.neighbors import NearestNeighbors
from pydantic import BaseModel
from typing import List, Optional

class Song(BaseModel):
    
    track_id: str
    track_name: str
    artists: str
    album_name: str
    popularity: float
    duration_min: float
    track_genre: str
    img: str
    preview: str

class RecommendationResponse(BaseModel):
    
    similar_songs: List[Song]
    popular_in_genre: List[Song]


DATA_FILE = 'music_final.csv'
df = None
pca_features = None  
track_id_to_index = None 
nn_model = None 

basic_columns = ['track_id', 'track_name', 'artists', 'album_name', 'popularity', 'duration_min', 'track_genre', 'img', 'preview']


def load_data_and_model():
    
    global df, pca_features, track_id_to_index, nn_model 
    
    try:
        df = pd.read_csv(DATA_FILE)
        
        df = df.drop_duplicates(subset=['track_id']).reset_index(drop=True)
        
        pca_feature_columns = ['PCA1', 'PCA2', 'PCA3', 'PCA4', 'PCA5']
        pca_features = df[pca_feature_columns].values
        
        track_id_to_index = pd.Series(df.index, index=df['track_id'])
        
        print(f"Successfully loaded {len(df)} songs and their features.")
        
        
        print("Building K-Nearest Neighbors index (using cosine metric)...")
        
        nn_model = NearestNeighbors(n_neighbors=51, metric='cosine', algorithm='auto')
        nn_model.fit(pca_features)
        print("KNN index built successfully.")
        
        
        print("Recommendation engine is ready for on-demand requests.")
        
    except FileNotFoundError:
        print(f"FATAL ERROR: Data file '{DATA_FILE}' not found.")
    except Exception as e:
        print(f"FATAL ERROR: An error occurred during data loading: {e}")


app = FastAPI(
    title="Song Recommendation API",
    description="An API for getting song recommendations and details (Optimized with KNN).",
    version="3.0.0" 
)

@app.on_event("startup")
async def startup_event():
    
    print("Application startup...")
    load_data_and_model()


def get_song_details_from_ids(track_ids: List[str]) -> List[Song]:
    
    try:
        results_df = df[df['track_id'].isin(track_ids)]
        return [Song(**row) for row in results_df[basic_columns].to_dict(orient='records')]
    except Exception as e:
        print(f"Error getting song details: {e}")
        return []

def convert_df_to_songs(data_frame: pd.DataFrame) -> List[Song]:
    
    return [Song(**row) for row in data_frame[basic_columns].to_dict(orient='records')]


@app.get("/")
def read_root():
    return {"message": "Welcome to the Song Recommendation API. Go to /docs for details."}


@app.get("/popular", response_model=List[Song])
def get_popular_songs(skip: int = 0, limit: int = 100):
    if df is None:
        raise HTTPException(status_code=503, detail="Data is not loaded yet.")
        
    popular_songs_df = df.sort_values(by='popularity', ascending=False)
    paginated_df = popular_songs_df.iloc[skip : skip + limit]
    
    return convert_df_to_songs(paginated_df)


@app.get("/search", response_model=List[Song])
def search_songs(query: str):
    
    if df is None:
        raise HTTPException(status_code=503, detail="Data is not loaded yet.")
    
    if not query:
        raise HTTPException(status_code=400, detail="A 'query' parameter is required.")
        
    query_lower = query.lower()
    
    search_results_df = df[
        df['track_name'].str.lower().str.contains(query_lower, na=False) |
        df['artists'].str.lower().str.contains(query_lower, na=False) |
        df['album_name'].str.lower().str.contains(query_lower, na=False)
    ]
    
    search_results_df = search_results_df.sort_values(by='popularity', ascending=False).head(50)
    
    return convert_df_to_songs(search_results_df)


@app.get("/album/{album_name}", response_model=List[Song])
def get_songs_by_album(album_name: str):
    
    if df is None:
        raise HTTPException(status_code=503, detail="Data is not loaded yet.")
        
    album_songs_df = df[df['album_name'].str.lower() == album_name.lower()]
    
    if album_songs_df.empty:
        raise HTTPException(status_code=404, detail=f"Album '{album_name}' not found.")
    
    album_songs_df = album_songs_df.sort_values(by='popularity', ascending=False)
    
    return convert_df_to_songs(album_songs_df)


@app.get("/recommend/{track_id}", response_model=RecommendationResponse)
def get_recommendations(track_id: str, limit: int = 10):
    
    
    if df is None or pca_features is None or track_id_to_index is None or nn_model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet.")
        
    if track_id not in track_id_to_index:
        raise HTTPException(status_code=404, detail="Song 'track_id' not found in the dataset.")
    
    
    song_index = track_id_to_index[track_id]
    song_vector = pca_features[song_index].reshape(1, -1)
    
    
    distances, indices = nn_model.kneighbors(song_vector, n_neighbors=limit + 1)
    
    
    top_song_indices = indices[0][1:]
    
    
    similar_song_ids = df.iloc[top_song_indices]['track_id'].tolist()
    similar_songs = get_song_details_from_ids(similar_song_ids)

    try:
        seed_song_genre = df.iloc[song_index]['track_genre']
    except Exception:
        raise HTTPException(status_code=500, detail="Could not find genre for the seed song.")

    exclude_ids = set(similar_song_ids)
    exclude_ids.add(track_id)
    
    popular_in_genre_df = df[
        (df['track_genre'] == seed_song_genre) &
        (~df['track_id'].isin(exclude_ids)) 
    ].sort_values(by='popularity', ascending=False).head(limit)
    
    popular_in_genre_songs = convert_df_to_songs(popular_in_genre_df)
    
    return RecommendationResponse(
        similar_songs=similar_songs,
        popular_in_genre=popular_in_genre_songs
    )


@app.get("/genres", response_model=List[str])
def get_all_genres():
    
    if df is None:
        raise HTTPException(status_code=503, detail="Data is not loaded yet.")
        
    unique_genres = df['track_genre'].unique().tolist()
    unique_genres.sort()
    return unique_gensres

@app.get("/songs_by_genre", response_model=List[Song])
def get_songs_by_genre(genre: str, limit: int = 50, shuffle: bool = False):
    
    if df is None:
        raise HTTPException(status_code=503, detail="Data is not loaded yet.")
    
    genre_songs_df = df[df['track_genre'].str.lower() == genre.lower()]
    
    if genre_songs_df.empty:
        genre_songs_df = df[df['track_genre'] == genre]
        
    if genre_songs_df.empty:
        raise HTTPException(status_code=404, detail=f"Genre '{genre}' not found.")

    if shuffle:
        
        sorted_genre_songs = genre_songs_df.sort_values(by='popularity', ascending=False)

        less_popular_songs_df = sorted_genre_songs.iloc[limit:]
        
        
        if less_popular_songs_df.empty:
            num_songs_to_sample = min(limit, len(sorted_genre_songs))
            final_songs_df = sorted_genre_songs.sample(n=num_songs_to_sample)
        else:
            num_songs_to_sample = min(limit, len(less_popular_songs_df))
            final_songs_df = less_popular_songs_df.sample(n=num_songs_to_sample)
            
    else:
        final_songs_df = genre_songs_df.sort_values(by='popularity', ascending=False).head(limit)
    
    return convert_df_to_songs(final_songs_df)