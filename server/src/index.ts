import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import movieRoutes from './utils/movieRoutes.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api', movieRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'healthy' });
});

app.listen(Number(PORT), '0.0.0.0', () => {
	console.log(`Server is running on port ${PORT}`);
});
