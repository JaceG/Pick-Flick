export const transformMovieStreaming = (streaming: any[] = []) =>
	streaming.map((option) => ({
		link: option.link || '',
		service: {
			imageSet: {
				lightThemeImage:
					option.service?.imageSet?.lightThemeImage || '',
				darkThemeImage: option.service?.imageSet?.darkThemeImage || '',
			},
		},
	}));
