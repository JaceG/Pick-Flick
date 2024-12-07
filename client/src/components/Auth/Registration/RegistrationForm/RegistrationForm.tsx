import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import ErrorMessage from '../../../ErrorMessage/ErrorMessage';
import InputField from '../../../InputField/InputField';

interface RegistrationFormProps {
	onRegisterSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
	onRegisterSuccess,
}) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const API_BASE_URL =
		process.env.NODE_ENV === 'production'
			? 'https://pick-flick.onrender.com'
			: 'http://localhost:3001';

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccessMessage(null);

		if (!username || !email || !password || !confirmPassword) {
			setError('All fields are required');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		try {
			console.log('Sending registration request:', { username, email });

			const response = await axios.post(
				`${API_BASE_URL}/api/users/register`,
				{
					username,
					email,
					password,
				}
			);

			console.log('Registration response:', response);

			if (response.status === 201) {
				setSuccessMessage('Registration successful!');
				onRegisterSuccess();
			} else {
				setError('Registration failed. Please try again.');
			}
		} catch (err: any) {
			console.error('Error during registration:', err);
			setError(
				err.response?.data?.message ||
					'An error occurred during registration.'
			);
		}
	};

	return (
		<form className='registration-form' onSubmit={handleSubmit}>
			{error && <ErrorMessage message={error} />}
			{successMessage && (
				<p className='success-message'>{successMessage}</p>
			)}

			<InputField
				id='username'
				label='Username'
				value={username}
				type='text'
				onChange={(e) => setUsername(e.target.value)}
			/>
			<InputField
				id='email'
				label='Email'
				value={email}
				type='email'
				onChange={(e) => setEmail(e.target.value)}
			/>
			<InputField
				id='password'
				label='Password'
				value={password}
				type='password'
				onChange={(e) => setPassword(e.target.value)}
			/>
			<InputField
				id='confirmPassword'
				label='Confirm Password'
				value={confirmPassword}
				type='password'
				onChange={(e) => setConfirmPassword(e.target.value)}
			/>

			<button type='submit' className='register-button'>
				Register
			</button>
		</form>
	);
};

export default RegistrationForm;
