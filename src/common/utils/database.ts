import { drizzle } from 'drizzle-orm/d1';
import { Bindings } from '../types/app.types';

const getDatabaseClient = (env: Bindings)=>{
	return drizzle(env.DB);
}

export default getDatabaseClient;


