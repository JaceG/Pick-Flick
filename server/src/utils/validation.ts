export const validateSaveMovieInput = (data: any) => {
	const { movieId, title, userId } = data;
	if (!userId || !movieId || !title) {
		return {
			valid: false,
			message: 'Missing required fields: userId, movieId, or title.',
		};
	}
	return { valid: true };
};

export const validateQueryParams = (params: any) => {
	const { startYear, endYear, minRuntime, maxRuntime } = params;

	if (startYear && isNaN(Number(startYear))) {
		throw new Error('Start year must be a valid number.');
	}
	if (endYear && isNaN(Number(endYear))) {
		throw new Error('End year must be a valid number.');
	}
	if (startYear && endYear && Number(startYear) > Number(endYear)) {
		throw new Error('Start year cannot be greater than end year.');
	}
	if (minRuntime && isNaN(Number(minRuntime))) {
		throw new Error('Minimum runtime must be a valid number.');
	}
	if (maxRuntime && isNaN(Number(maxRuntime))) {
		throw new Error('Maximum runtime must be a valid number.');
	}
};
