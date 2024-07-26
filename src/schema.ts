import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const moviesModel = sqliteTable('movies', {
    id: integer('id', { mode: 'number' }).primaryKey(),
    title: text('title').notNull(),
	genres: text('genres').notNull(),
	tmdb_id: integer('tmdb_id', { mode: 'number' }).notNull(),
    average_rating: real('average_rating').notNull(),
});

export const usersModel = sqliteTable('users', {
    id: integer('id', { mode: 'number' }).primaryKey(),
});

export const cbrPredictionsModel = sqliteTable('cbr_predictions', {
    id: integer('id', { mode: 'number' }).primaryKey(),
	movie_id: integer('movie_id', { mode: 'number' }).notNull(),
	sim_movie_id: integer('sim_movie_id', { mode: 'number' }).notNull(),
    score: real('score').notNull(),
});

export const svdPredictionsModel = sqliteTable('svd_predictions', {
    id: integer('id', { mode: 'number' }).primaryKey(),
	user_id: integer('user_id', { mode: 'number' }).notNull(),
	movie_id: integer('movie_id', { mode: 'number' }).notNull(),
    score: real('score').notNull(),
});


