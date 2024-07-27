import { AxiosRequestConfig } from "axios";
import {
  GenreResponse,
  ImageResponse,
  Movie,
  MoviesResponse,
  PersonnelResponse,
} from "./tmdb.types";
import { axiosInstance } from "../../common/utils/http.client";

const MOVIE_PATH = "/movie";
const GENRE_LIST_PATH = `/genre${MOVIE_PATH}/list`;

const fetchData = async <T>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const resp = await axiosInstance.get<T>(path, config);
  return resp.data as T;
};

export const getMovies = (params: { category: string; page: number }) =>
  fetchData<MoviesResponse>(`${MOVIE_PATH}/${params.category}`, {
    params: { page: params.page },
  });

export const searchMovies = (params: { query: string; page: number }) =>
  fetchData<MoviesResponse>(`/search/movie`, {
    params: { query: params.query, page: params.page },
  });

export const getGenres = () => fetchData<GenreResponse>(GENRE_LIST_PATH);

export const getMovie = (id: string) => fetchData<Movie>(`${MOVIE_PATH}/${id}`);

export const getActors = (id: string) =>
  fetchData<PersonnelResponse>(`${MOVIE_PATH}/${id}/credits`);

export const getMovieImages = (id: string) =>
  fetchData<ImageResponse>(`${MOVIE_PATH}/${id}/images`, {
    params: { language: "null" },
  });

export const getRecommendations = (id: string) =>
  fetchData<MoviesResponse>(`${MOVIE_PATH}/${id}/recommendations`, {
    params: {
      language: "null",
      page: 1,
    },
  });

export const findAllGenres = async () => {
  const movieGenres = await getGenres();
  return movieGenres.genres || [];
};

export const getMovieList = async(ids: string[])=> {
	const movies: Movie[] = [];
  const results = await Promise.allSettled(
    ids.map((id) => getMovie(id)),
  );

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      movies.push(result.value);
    }
  });
  return movies;
}
