import { Router } from 'express';
import { getRandomMovie, saveMovie } from '../controllers/movieController.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.get('/random', getRandomMovie);

// Add POST route to save a movie, protected by authMiddleware
router.post('/save', authMiddleware, saveMovie);

export default router;
