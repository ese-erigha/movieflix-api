import { buildPagination } from "../common/utils/pagination";
import { DrizzleD1Database } from "drizzle-orm/d1/index.js";
import { moviesModel } from "../schema";
import { inArray, eq, desc } from "drizzle-orm";

export class MovieService {
	constructor(private db: DrizzleD1Database<Record<string, never>>){}

	public async findManyByIds(ids: number[]){
		return this.db.select().from(moviesModel).where(inArray(moviesModel.id,ids));
	}

	public async findById(id: number){
		const result = await this.db.select().from(moviesModel).where(eq(moviesModel.id, id));
		return result[0] || null;
	}

	public async findTopRatedMovies(page: number,size: number){
		const { start } = buildPagination(page, size);
		return this.db.select().from(moviesModel).orderBy(desc(moviesModel.average_rating)).limit(size).offset(start);
	}
}
