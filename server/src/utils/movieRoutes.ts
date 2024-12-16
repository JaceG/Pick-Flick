import { Router } from 'express';
import {
	getRandomMovie,
	getRandomMovieByStreaming,
} from '../controllers/movieController.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.get('/random', getRandomMovie);
router.get('/random-streaming', getRandomMovieByStreaming);

export default router;
