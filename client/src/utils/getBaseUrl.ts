let cachedBaseUrl: string | null = null; // Cache the result to avoid repeated checks

export const getBaseUrl = async (): Promise<string> => {
	if (cachedBaseUrl) {
		return cachedBaseUrl; // Return cached result if available
	}

	// In production, always use the production URL
	if (process.env.NODE_ENV === 'production') {
		cachedBaseUrl = 'https://pick-flick.onrender.com';
		return cachedBaseUrl;
	}

	// In development, try local server
	try {
		const response = await fetch('http://localhost:3001/health');
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
		console.error('Local server not available:', err);
	}

	// Fallback to production
	cachedBaseUrl = 'https://pick-flick.onrender.com';
	console.log('Falling back to production server:', cachedBaseUrl);

	// Ensure the return type is always a string
	return cachedBaseUrl;
};
