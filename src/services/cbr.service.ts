import { DrizzleD1Database } from "drizzle-orm/d1/index.js";
import { eq } from "drizzle-orm";
import { buildPagination } from "../common/utils/pagination";
import { cbrPredictionsModel } from "../schema";

export class CbrService{
	constructor(private db: DrizzleD1Database<Record<string, never>>){}

	public async findSimilarMovies(movieId: number, { page, size }: {page: number, size: number;}){
		const { start } = buildPagination(page, size);
		return this.db.select().from(cbrPredictionsModel).where(eq(cbrPredictionsModel.movie_id, movieId)).limit(size).offset(start);
	}
}
