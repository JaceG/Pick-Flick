export interface Movie {
	movieId: string;
	title: string;
	poster?: string;
	genres: string[];
	releaseYear?: string;
	synopsis?: string;
	runtime?: number;
	cast?: string[];
	directors?: string[];
	producers?: string[];
	streaming?: {
		link: string;
		service: {
			imageSet: {
				lightThemeImage: string;
				darkThemeImage: string;
			};
		};
	}[];
}

// Minimal type for watched movies
export interface WatchedMovie {
	id: string;
	title: string;
	poster: string;
	year: string;
	movieId?: string;
}
