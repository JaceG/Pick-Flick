import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export environment variables
export const TMDB_API_KEY = process.env.TMDB_API_KEY;
export const MOTN_API_KEY = process.env.MOTN_API_KEY;
export const DATABASE_URL = process.env.DATABASE_URL;

// Ensure required variables are defined
if (!TMDB_API_KEY) {
	throw new Error('TMDB_API_KEY is not defined in the environment variables');
}
