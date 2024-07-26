import { Hono } from 'hono';
import getDatabaseClient from '../common/utils/database';
import { Bindings } from '../common/types/app.types';

const router = new Hono<{ Bindings: Bindings }>();

router.get('/:slug/comments', async c => {
	const db = getDatabaseClient(c.env);
});


export default router;
