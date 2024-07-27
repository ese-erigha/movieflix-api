import { Hono } from 'hono';
import { Bindings } from '../common/types/app.types';
import { getRecommenderService } from '../ioc/container';
import { PAGINATION_LIMIT } from '../common/utils/pagination';

const router = new Hono<{ Bindings: Bindings }>();

router.get('/user/:userId/:page', async c => {
	const { userId, page } = c.req.param();
	const service = getRecommenderService(c.env);
	const response = await service.recommendMoviesForUser(parseInt(userId), parseInt(page));
	return c.json(response);
});

router.get('/movie/:movieId/:page', async c => {
	const { movieId, page } = c.req.param();
	const service = getRecommenderService(c.env);
	const response = await service.recommendSimilarMovies(parseInt(movieId), parseInt(page));
	return c.json(response);
});

router.get('/movies/top-rated/:page', async c => {
	const { page } = c.req.param();
	const service = getRecommenderService(c.env);
	const response = await service.fetchTopRatedMovies(parseInt(page), PAGINATION_LIMIT);
	return c.json(response);
});


export default router;
