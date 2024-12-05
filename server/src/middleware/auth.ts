import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a custom type for the JWT payload
interface CustomJwtPayload extends JwtPayload {
	id: number; // Assuming the id is a number
}

// Middleware to verify JWT token and attach user to the request
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	console.log('Request Headers:', req.headers); // Log all request headers

	const authHeader = req.headers.authorization;
	console.log('Authorization Header:', authHeader); // Log the received Authorization header

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res
			.status(401)
			.json({ message: 'Unauthorized: Invalid token format' });
	}

	const token = authHeader.split(' ')[1];
	console.log('Extracted Token:', token); // Log the extracted token

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as CustomJwtPayload;
		console.log('Decoded Token:', decoded); // Log the decoded token payload

		if (!decoded || typeof decoded.id !== 'number') {
			return res
				.status(401)
				.json({ message: 'Unauthorized: Invalid token payload' });
		}

		req.user = { id: decoded.id };
		next();
	} catch (error: any) {
		console.error('JWT Verification Error:', error);

		if (error.name === 'TokenExpiredError') {
			return res
				.status(401)
				.json({ message: 'Session expired. Please log in again.' });
		}

		return res.status(401).json({ message: 'Unauthorized: Invalid token' });
	}
};

export default authMiddleware;
