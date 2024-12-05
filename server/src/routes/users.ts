import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// User registration route
router.post('/register', async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({
			success: false,
			message: 'All fields are required',
		});
	}

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: 'User already exists',
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		return res.status(201).json({
			success: true,
			message: 'User registered successfully',
			data: {
				id: newUser.id,
				username: newUser.username,
				email: newUser.email,
			},
		});
	} catch (error) {
		console.error('Registration Error:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
});

// User login route
router.post('/login', async (req: Request, res: Response) => {
	const { username, password } = req.body;

	console.log('Login request body:', req.body); // Debugging

	if (!username || !password) {
		return res.status(400).json({
			success: false,
			message: 'Username and password are required',
		});
	}

	try {
		// Check if the user exists
		const user = await User.findOne({ where: { username } });
		console.log('User found:', user); // Debugging

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		// Verify the password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		console.log('Password valid:', isPasswordValid); // Debugging

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: 'Invalid password',
			});
		}

		// Generate a JWT token with 1-hour expiration
		if (!process.env.JWT_SECRET) {
			console.error(
				'JWT_SECRET is not defined in the environment variables'
			);
			return res.status(500).json({
				success: false,
				message: 'Internal server error: JWT_SECRET is missing',
			});
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});
		console.log('Generated Token:', token); // Debugging

		// Send the token and user info in the response
		return res.status(200).json({
			success: true,
			message: 'Login successful',
			data: {
				token,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			},
		});
	} catch (error) {
		// Narrow the error type to access its properties
		if (error instanceof Error) {
			console.error('Login Error:', error.message); // Log the error message
		} else {
			console.error('Unknown Login Error:', error); // Log the unknown error
		}

		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
});

// Logout route (optional)
router.post('/logout', (req: Request, res: Response) => {
	// Since JWT is stateless, the logout is handled on the frontend
	return res.status(200).json({
		success: true,
		message: 'Logged out successfully',
	});
});

export default router;
