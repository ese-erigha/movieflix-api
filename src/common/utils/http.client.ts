import axios from "axios";
import * as config from "../../config";
import { Bindings } from "../types/app.types";

// https://www.npmjs.com/package/nock#axios
// axios.defaults.adapter = require('axios/lib/adapters/http');

export const axiosInstance = axios.create({
  baseURL: config.MOVIE_DB_BASE_URL,
  params: {
    api_key: config.MOVIE_DB_API_KEY,
    language: "en-US",
  },
});

export function createClient(env: Bindings){
	return axios.create({
  	baseURL: "https://api.themoviedb.org/3",
  	params: {
    	api_key: env.TMDB_API_KEY,
    	language: "en-US",
  	},
	});
}
