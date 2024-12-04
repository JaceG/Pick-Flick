import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
	plugins: [react()],
	base: mode === 'production' ? '/' : '/', // Set base URL for production or development
	server: {
		port: 3000,
		open: true,
		proxy:
			mode === 'development'
				? {
						'/api': {
							target: 'http://localhost:3001',
							changeOrigin: true,
							secure: false,
						},
				  }
				: undefined, // Proxy only for development
	},
	build: {
		outDir: 'dist', // Output directory for production build
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify(mode), // Optional: Define environment-specific values
	},
}));
