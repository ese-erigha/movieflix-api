import { DrizzleD1Database } from "drizzle-orm/d1/index.js";
import { eq } from "drizzle-orm";
import { buildPagination } from "../common/utils/pagination";
import { svdPredictionsModel } from "../schema";

export class SvdService{
	constructor(private db: DrizzleD1Database<Record<string, never>>){}

	public async findMoviesForUser(userId: number, { page, size }: {page: number, size: number;}){
		const { start } = buildPagination(page, size);
		return this.db.select().from(svdPredictionsModel).where(eq(svdPredictionsModel.user_id, userId)).limit(size).offset(start);
	}
}
