import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

const router = express.Router();

// User registration route
router.post('/register', async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(409).json({ message: 'User already exists' });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		// Return success response
		res.status(201).json({
			message: 'User registered successfully',
			user: {
				id: newUser.id,
				username: newUser.username,
				email: newUser.email,
			},
		});
	} catch (error) {
		console.error('Registration Error:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// User login route
router.post('/login', async (req: Request, res: Response) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: 'Username and password are required' });
	}

	try {
		// Check if the user exists
		const user = await User.findOne({ where: { username } });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Verify the password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid password' });
		}

		// Return success response
		res.status(200).json({
			message: 'Login successful',
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		console.error('Login Error:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

export default router;
