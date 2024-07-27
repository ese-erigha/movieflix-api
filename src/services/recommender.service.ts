import { HTTPException } from 'hono/http-exception'
import { MovieResponseDto } from "../common/dto/movie.dto";
import { CBR_Prediction, Movie, SVD_Prediction } from "../common/types/database.types";
import { getPaginationOutput, PAGINATION_LIMIT } from "../common/utils/pagination";
import { CbrService } from "./cbr.service";
import { MovieService } from "./movie.service";
import { SvdService } from "./svd.service";
import { UserService } from "./user.service";
import { MovieMapper } from "../common/utils/mapper";
import { TMDBService } from './tmdb.service';


export class RecommenderService{
	constructor(
		private userService: UserService,
		private movieService: MovieService,
		private cbrService: CbrService,
		private svdService: SvdService,
		private tmdbService: TMDBService){}

		public async recommendMoviesForUser(
			userId: number,
			page: number = 1,
			size: number = PAGINATION_LIMIT): Promise<MovieResponseDto> {

  			const user = await this.userService.findById(userId);

  			if (!user) {
    			return this.fetchTopRatedMovies(page, size);
  			}

  			const recommendations = await this.svdService.findMoviesForUser(userId, {page, size});

  			const movieIds: number[] = [];
  			const movieSvdMap: Record<number, SVD_Prediction> = {};

  			recommendations.forEach((recommendation) => {
    			movieIds.push(recommendation.movie_id);
    			movieSvdMap[recommendation.movie_id] = recommendation;
  			});

  			const movies = await this.movieService.findManyByIds(movieIds);
  			const tmdbMovieMap: Record<number, number> = {};
			const tmdbMovieIds: string[] = [];
  			movies.forEach((movie) => {
				tmdbMovieIds.push(movie.tmdb_id.toString());
				tmdbMovieMap[movie.tmdb_id] = movie.id
			});

  			const tmdbMovies = await this.tmdbService.getMovieList(tmdbMovieIds);

  			return {
    			results: MovieMapper.fromSVD(tmdbMovies, tmdbMovieMap, movieSvdMap),
    			page,
    			...getPaginationOutput(size),
  			};
		}

		public async recommendSimilarMovies(
			movieId: number,
  			page: number = 1,
  			size: number = PAGINATION_LIMIT){
				const movie = await this.movieService.findById(movieId);
  				if (!movie) {
					throw new HTTPException(404, { message: `movie not found - ${movieId}` })
  				}

  				const recommendations = await this.cbrService.findSimilarMovies(movieId, { page, size });

  				const simMovieIds: number[] = [];
  				const simCbrMap: Record<number, CBR_Prediction> = {};

  				recommendations.forEach((recommendation) => {
    				simMovieIds.push(recommendation.sim_movie_id);
    				simCbrMap[recommendation.sim_movie_id] = recommendation;
  				});

  				const simMovies = await this.movieService.findManyByIds(simMovieIds);
  				const tmdbSimMap: Record<number, number> = {};
				const tmdbMovieIds: string[] = [];
  				simMovies.forEach((simMovie) => {
					tmdbMovieIds.push(simMovie.tmdb_id.toString());
					tmdbSimMap[simMovie.tmdb_id] = simMovie.id
				});

				const tmdbMovies = await this.tmdbService.getMovieList(tmdbMovieIds);

  				return {
    				results: MovieMapper.fromCBR(tmdbMovies, tmdbSimMap, simCbrMap),
    				page,
    				...getPaginationOutput(size),
  				};
		}

		public async fetchTopRatedMovies(page: number, size: number): Promise<MovieResponseDto>{
			const movies = await this.movieService.findTopRatedMovies(page, size);
  			const movieMap: Record<number, Movie> = {};
			const tmdbMovieIds: string[] = [];
  			movies.forEach((movie) => {
				tmdbMovieIds.push(movie.tmdb_id.toString());
				movieMap[movie.tmdb_id] = movie
			});
  			const tmdbMovies = await this.tmdbService.getMovieList(tmdbMovieIds);

  			return {
    			results: MovieMapper.fromTMDB(tmdbMovies, movieMap),
    			page,
    			...getPaginationOutput(size, 9742),
  			};
		}
}
