let cachedBaseUrl: string | null = null; // Cache the result to avoid repeated checks

export const getBaseUrl = async (): Promise<string> => {
	if (cachedBaseUrl) {
		return cachedBaseUrl; // Return cached result if available
	}

	try {
		const response = await fetch('http://localhost:3001/health', {
			method: 'GET',
			mode: 'cors', // Ensure CORS mode is set for browser environments
		});

		if (response.ok) {
			console.log('Local server is available.');
			cachedBaseUrl = 'http://localhost:3001'; // Cache the result
			return cachedBaseUrl;
		} else {
			console.warn(
				`Health check failed with status: ${response.status}. Falling back to production.`
			);
		}
	} catch (err) {
		console.error('Error checking local server availability:', err);
	}

	// Fallback to production server
	cachedBaseUrl =
		import.meta.env.VITE_API_BASE_URL || 'https://pick-flick.onrender.com';
	console.log('Falling back to production server:', cachedBaseUrl);

	// Ensure the return type is always a string
	return cachedBaseUrl || 'https://pick-flick.onrender.com';
};
