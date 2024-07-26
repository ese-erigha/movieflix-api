import { DrizzleD1Database } from "drizzle-orm/d1/index.js";
import { eq, } from "drizzle-orm";
import { usersModel } from "../schema";
export class UserService{
	constructor(private db: DrizzleD1Database<Record<string, never>>){}

	public async findById(id: number){
		const result = await this.db.select().from(usersModel).where(eq(usersModel.id, id));
		return result[0] || null;
	}
}
