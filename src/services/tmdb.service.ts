import { AxiosInstance, AxiosRequestConfig } from "axios";
import { Bindings } from "../common/types/app.types";
import { createClient } from "../common/utils/http.client";
import { GenreResponse, ImageResponse, Movie, MoviesResponse, PersonnelResponse } from "../api/tmdb/tmdb.types";

const MOVIE_PATH = "/movie";
const GENRE_LIST_PATH = `/genre${MOVIE_PATH}/list`;

export class TMDBService {
	private httpClient: AxiosInstance;

	constructor(env: Bindings){
		this.httpClient = createClient(env);
	}

	private async fetchData <T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    	const resp = await this.httpClient.get<T>(path, config);
  		return resp.data as T;
	};

	public getMovies(params: { category: string; page: number }){
		return this.fetchData<MoviesResponse>(`${MOVIE_PATH}/${params.category}`, {
    		params: { page: params.page },
 		});
	}

	public searchMovies(params: { query: string; page: number }){
		return this.fetchData<MoviesResponse>(`/search/movie`, {
    		params: { query: params.query, page: params.page },
  		});
	}

	public getGenres(){
		return this.fetchData<GenreResponse>(GENRE_LIST_PATH);
	}

	public getMovie(id: string){
		return this.fetchData<Movie>(`${MOVIE_PATH}/${id}`);
	}

	public getActors(id: string){
		return this.fetchData<PersonnelResponse>(`${MOVIE_PATH}/${id}/credits`);
	}

	public getMovieImages(id: string){
		return this.fetchData<ImageResponse>(`${MOVIE_PATH}/${id}/images`, {
    		params: { language: "null" },
  		});
	}

	public getRecommendations(id: string){
		return this.fetchData<MoviesResponse>(`${MOVIE_PATH}/${id}/recommendations`, {
    		params: {
      			language: "null",
      			page: 1,
    		},
  		});
	}

	public async findAllGenres(){
  		const movieGenres = await this.getGenres();
  		return movieGenres.genres || [];
	};

	public async getMovieList(ids: string[]){
		const movies: Movie[] = [];
  		const results = await Promise.allSettled(
    		ids.map((id) => this.getMovie(id)),
  		);

  		results.forEach((result) => {
    		if (result.status === "fulfilled") {
     			movies.push(result.value);
    		}
  		});
  		return movies;
	}
}
