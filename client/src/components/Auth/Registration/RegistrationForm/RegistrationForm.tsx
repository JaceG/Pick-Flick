import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';
import InputField from '../../../InputField/InputField';

interface RegistrationFormProps {
	onRegisterSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
	onRegisterSuccess,
}) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const API_BASE_URL =
		process.env.NODE_ENV === 'production'
			? 'https://www.pickflick.app'
			: 'http://localhost:3001';

	const SECONDARY_API_BASE_URL = 'https://pick-flick.onrender.com';

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			// Try the primary API base URL first
			const response = await axios.post(
				`${API_BASE_URL}/api/users/register`,
				{
					username,
					password,
					email,
				}
			);

			const token = response.data.data.token;

			if (!token) {
				throw new Error('No token provided in the response');
			}

			localStorage.setItem('token', token);

			onRegisterSuccess();
			navigate('/auth/login');
		} catch (err: any) {
			console.error(
				'Primary API registration failed, trying secondary API',
				err
			);

			// If the primary API fails, try the secondary API base URL
			try {
				const response = await axios.post(
					`${SECONDARY_API_BASE_URL}/api/users/register`,
					{
						username,
						password,
						email,
					}
				);

				const token = response.data.data.token;

				if (!token) {
					throw new Error('No token provided in the response');
				}

				localStorage.setItem('token', token);

				onRegisterSuccess();
				navigate('/auth/login');
			} catch (secondaryErr: any) {
				console.error(
					'Secondary API registration failed',
					secondaryErr
				);
				setError(
					secondaryErr.response?.data?.message ||
						'An error occurred during registration'
				);
			}
		}
	};

	return (
		<div className='registration-form-container'>
			<h2>Register</h2>
			<form className='registration-form' onSubmit={handleRegister}>
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
						id='email'
						type='email'
						value={email}
						label='Email'
						placeholder='Enter your email'
						onChange={(e) => setEmail(e.target.value)}
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
					Register
				</button>
			</form>
		</div>
	);
};

export default RegistrationForm;
