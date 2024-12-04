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
			console.log('Local server is available');
			cachedBaseUrl = 'http://localhost:3001'; // Cache the result
			return cachedBaseUrl;
		}
	} catch (err) {
		console.warn('Local server not available, falling back to production.');
		console.error('Error:', err); // Log the error for debugging
	}

	console.log('Falling back to production server.');
	cachedBaseUrl = 'https://pick-flick.onrender.com'; // Cache the fallback
	return cachedBaseUrl;
};
