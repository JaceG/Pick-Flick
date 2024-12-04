import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthHandlerProps {
	loggedIn: boolean;
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthHandler: React.FC<AuthHandlerProps> = ({ loggedIn, setLoggedIn }) => {
	const navigate = useNavigate();

	// Automatically log out the user after a certain period of inactivity
	useEffect(() => {
		let logoutTimer: NodeJS.Timeout;

		if (loggedIn) {
			// Set up a timer to log out the user after 30 minutes of inactivity
			logoutTimer = setTimeout(() => {
				setLoggedIn(false);
				localStorage.removeItem('token'); // Clear token from storage
				navigate('/auth/login'); // Redirect to login page
			}, 30 * 60 * 1000); // 30 minutes
		}

		return () => clearTimeout(logoutTimer); // Clear timer on cleanup
	}, [loggedIn, setLoggedIn, navigate]);

	return null; // This component doesn't render anything
};

export default AuthHandler;
