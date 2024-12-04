import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AutoLogoutHandlerProps {
	loggedIn: boolean;
	setLoggedIn: (value: boolean) => void;
}

const AutoLogoutHandler: React.FC<AutoLogoutHandlerProps> = ({
	loggedIn,
	setLoggedIn,
}) => {
	const navigate = useNavigate();

	useEffect(() => {
		let activityTimer: NodeJS.Timeout;

		// Function to log out the user
		const handleLogout = () => {
			setLoggedIn(false); // Update the loggedIn state
			localStorage.removeItem('token'); // Clear the token from localStorage
			alert('You have been logged out due to inactivity.');
			navigate('/auth/login'); // Redirect to the login page
		};

		// Function to reset the activity timer
		const resetActivityTimer = () => {
			clearTimeout(activityTimer);
			activityTimer = setTimeout(handleLogout, 60 * 60 * 1000); // 1 hour of inactivity
		};

		// Attach event listeners for user activity
		if (loggedIn) {
			window.addEventListener('mousemove', resetActivityTimer);
			window.addEventListener('keydown', resetActivityTimer);
			resetActivityTimer(); // Start the timer
		}

		// Cleanup on component unmount or logged out
		return () => {
			clearTimeout(activityTimer);
			window.removeEventListener('mousemove', resetActivityTimer);
			window.removeEventListener('keydown', resetActivityTimer);
		};
	}, [loggedIn, navigate, setLoggedIn]);

	return null; // This component doesn’t render anything
};

export default AutoLogoutHandler;
