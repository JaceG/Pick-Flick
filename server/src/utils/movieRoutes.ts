import { Router } from 'express';
import { getRandomMovie } from '../controllers/movieController.js';

const router = Router();

router.get('/random', getRandomMovie);

export default router;
