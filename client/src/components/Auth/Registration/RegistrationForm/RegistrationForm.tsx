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
	const navigate = useNavigate();

	const API_BASE_URL =
		process.env.NODE_ENV === 'production'
			? 'https://www.pickflick.app'
			: 'http://localhost:3001';

	const SECONDARY_API_BASE_URL = 'https://pick-flick.onrender.com';

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			// Try the primary API base URL first
			const response = await axios.post(
				`${API_BASE_URL}/api/users/login`,
				{
					username,
					password,
				}
			);

			const token = response.data.data.token;

			if (!token) {
				throw new Error('No token provided in the response');
			}

			localStorage.setItem('token', token);

			onLogin();
			navigate('/');
		} catch (err: any) {
			console.error(
				'Primary API login failed, trying secondary API',
				err
			);

			// If the primary API fails, try the secondary API base URL
			try {
				const response = await axios.post(
					`${SECONDARY_API_BASE_URL}/api/users/login`,
					{
						username,
						password,
					}
				);

				const token = response.data.data.token;

				if (!token) {
					throw new Error('No token provided in the response');
				}

				localStorage.setItem('token', token);

				onLogin();
				navigate('/');
			} catch (secondaryErr: any) {
				console.error('Secondary API login failed', secondaryErr);
				setError(
					secondaryErr.response?.data?.message ||
						'An error occurred during login'
				);
			}
		}
	};

	return (
		<div className='login-form-container'>
			<h2>Login</h2>
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
