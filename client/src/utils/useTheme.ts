// utils/useTheme.ts
import { useEffect } from 'react';

/**
 * Custom hook to automatically set the theme based on time of day.
 * Applies 'light' or 'dark' theme to the root element (document.documentElement).
 */
const useTheme = () => {
	useEffect(() => {
		const applyTheme = () => {
			const hour = new Date().getHours();
			const theme = hour >= 7 && hour <= 19 ? 'light' : 'dark';
			document.documentElement.className = theme;
		};

		// Apply the theme on initial render
		applyTheme();

		// Optional: Add an event listener for dynamic changes (e.g., user toggles system theme)
		const handleThemeChange = () => {
			applyTheme();
		};

		window.addEventListener('storage', handleThemeChange); // Example event listener

		return () => {
			window.removeEventListener('storage', handleThemeChange);
		};
	}, []);
};

export default useTheme;
