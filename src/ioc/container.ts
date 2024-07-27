import { CbrService } from "../services/cbr.service";
import { MovieService } from "../services/movie.service";
import { RecommenderService } from "../services/recommender.service";
import { SvdService } from "../services/svd.service";
import { UserService } from "../services/user.service";
import { Bindings } from "../common/types/app.types";
import getDatabaseClient from "../common/utils/database";
import { TMDBService } from "../services/tmdb.service";

function getDependencies(env: Bindings){
	const dbClient = getDatabaseClient(env);
	const movieService = new MovieService(dbClient);
	const userService = new UserService(dbClient);
	const cbrService = new CbrService(dbClient);
	const svdService = new SvdService(dbClient);
	const tmdbService = new TMDBService(env);

	return {
		movieService,
		userService,
		cbrService,
		svdService,
		tmdbService
	}
}

export function getRecommenderService(env: Bindings){
	const { userService, movieService, cbrService, svdService, tmdbService } = getDependencies(env);
	return new RecommenderService(userService, movieService, cbrService, svdService, tmdbService);
}
