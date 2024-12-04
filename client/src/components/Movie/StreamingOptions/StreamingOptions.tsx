import React from 'react';
import PlaceholderPoster from '../../../../../assets/img/placeholder.jpg';

interface StreamingOptionsProps {
	streaming?: {
		link: string;
		service: {
			imageSet?: {
				lightThemeImage?: string;
				darkThemeImage?: string;
			};
		};
	}[];
}

const StreamingOptions: React.FC<StreamingOptionsProps> = ({ streaming }) => {
	const getStreamingImage = (imageSet?: {
		lightThemeImage?: string;
		darkThemeImage?: string;
	}) => {
		const prefersDarkScheme = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;
		return prefersDarkScheme
			? imageSet?.darkThemeImage || PlaceholderPoster
			: imageSet?.lightThemeImage || PlaceholderPoster;
	};

	if (!streaming || streaming.length === 0) {
		return <p>No streaming options available.</p>;
	}

	return (
		<ul>
			{streaming.map((option, index) => (
				<li key={index}>
					<a
						href={option.link}
						target='_blank'
						rel='noopener noreferrer'>
						<img
							src={getStreamingImage(option.service.imageSet)}
							alt={`Streaming option ${index + 1}`}
						/>
					</a>
				</li>
			))}
		</ul>
	);
};

export default StreamingOptions;
