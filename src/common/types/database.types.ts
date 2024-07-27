export interface Movie {
	average_rating: number;
    genres: string;
    id: number;
    title: string;
    tmdb_id: number;
}

export interface SVD_Prediction {
  id: number;
  movie_id: number;
  score: number;
  user_id: number;
}

export interface CBR_Prediction {
  id: number;
  movie_id: number;
  score: number;
  sim_movie_id: number;
}
