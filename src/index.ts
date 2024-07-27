import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { showRoutes } from 'hono/dev'
import { cors } from 'hono/cors';
import { Bindings } from './common/types/app.types';
import recommenderRouter from './routers/recommender.router';

const app = new Hono<{ Bindings: Bindings }>();
app.use(logger())
app.use(cors());

app.get('/', async c => {
 	return c.text('Welcome');
});

app.route('/api/recommendations', recommenderRouter);

app.onError((err, c) => {
	if (err instanceof HTTPException) {
    	// Get the custom response
    	return err.getResponse()
  	}
	console.error(`${err}`);
	return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));

showRoutes(app, {
  verbose: true,
})

export default app;
