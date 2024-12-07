import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import InputField from '../../../InputField/InputField';

interface LoginFormProps {
	onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate(); // Initialize the useNavigate hook

	// Set the API base URL dynamically based on the environment
	const API_BASE_URL =
		process.env.NODE_ENV === 'production'
			? 'https://pick-flick.onrender.com'
			: 'http://localhost:3001';

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			// Send login request to the backend
			const response = await axios.post(
				`${API_BASE_URL}/api/users/login`,
				{
					username,
					password,
				}
			);

			console.log('API Response:', response.data); // Debugging the response

			// Extract token from the response
			const token = response.data.data.token; // Match the backend structure
			console.log('Extracted Token:', token);

			if (!token) {
				throw new Error('No token provided in the response');
			}

			// Save token to localStorage
			localStorage.setItem('token', token);
			console.log('Token saved to LocalStorage:', token);

			// Trigger login callback and navigate to home page
			onLogin();
			navigate('/');
		} catch (err: any) {
			console.error('Login Error:', err); // Debugging
			setError(
				err.response?.data?.message || 'An error occurred during login'
			);
		}
	};

	return (
		<div className='login-form-container'>
			<form className='login-form' onSubmit={handleLogin}>
				{error && <p className='error-message'>{error}</p>}
				<div className='form-group'>
					<InputField
						id='username'
						type='text'
						value={username}
						label='Username'
						placeholder='Enter your username'
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className='form-group'>
					<InputField
						id='password'
						type='password'
						value={password}
						label='Password'
						placeholder='Enter your password'
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type='submit' className='submit-button'>
					Login
				</button>
			</form>
		</div>
	);
};

export default LoginForm;
