import SavedMovie from '../models/SavedMovies.js';

export const checkIfMovieExists = async (userId: string, movieId: string) => {
	return await SavedMovie.findOne({ where: { userId, movieId } });
};

export const createNewMovie = async (movieData: any) => {
	return await SavedMovie.create(movieData);
};
