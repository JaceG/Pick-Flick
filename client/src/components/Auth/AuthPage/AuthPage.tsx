import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AuthPage.css';
import RegistrationForm from '../Registration/RegistrationForm/RegistrationForm';
import LoginForm from '../Login/LoginForm/LoginForm';

interface AuthPageProps {
	onLogin: () => void; // Callback function to handle successful login
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
	const { type } = useParams<{ type: string }>(); // Get the `type` parameter from the URL
	const navigate = useNavigate();

	const isRegistering = type === 'register'; // Determine if we are on the register page

	const handleRedirectToLogin = () => {
		navigate('/auth/login');
	};

	return (
		<div className='auth-page'>
			{isRegistering ? (
				<RegistrationForm onRegisterSuccess={handleRedirectToLogin} />
			) : (
				<LoginForm onLogin={onLogin} />
			)}
			<p>
				{isRegistering
					? 'Already have an account?'
					: "Don't have an account yet?"}{' '}
				<button
					className='toggle-link'
					onClick={() =>
						navigate(
							isRegistering ? '/auth/login' : '/auth/register'
						)
					}>
					{isRegistering ? 'Login' : 'Register'}
				</button>
			</p>
		</div>
	);
};

export default AuthPage;
