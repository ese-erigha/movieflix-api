import { TMDBMovie } from "../../api/tmdb/tmdb.types";
import { Movie } from "../types/database.types";

export type MappedMovie = Omit<Movie, "average_rating"> & { score: number };

export type MovieItemDto = TMDBMovie & {
  match_score: number;
  local_movie_id: number;
};

export type MovieResponseDto = {
  results: Array<MovieItemDto>;
  page: number;
  total_pages: number;
  total_results: number;
};
