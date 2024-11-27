import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serves static files in the entire client's dist folder
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
