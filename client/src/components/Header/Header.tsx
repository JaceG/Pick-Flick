// Header.tsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
	loggedIn: boolean;
	setLoggedIn: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ loggedIn, setLoggedIn }) => {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<header className='app-header'>
			<h1>Random Movie Generator</h1>
			<nav>
				{location.pathname !== '/' && (
					<button
						onClick={() => navigate('/')}
						className='back-button'>
						Back to Home
					</button>
				)}
				{!loggedIn ? (
					<>
						<Link to='/auth/login' className='nav-button'>
							Login
						</Link>
						<Link to='/auth/register' className='nav-button'>
							Register
						</Link>
					</>
				) : (
					<div className='logged-in-icon'>
						<span>👤 Logged In</span>
						<button
							onClick={() => {
								setLoggedIn(false);
								localStorage.removeItem('token'); // Clear the token
								navigate('/auth/login'); // Redirect to login
							}}
							className='logout-button'>
							Logout
						</button>
						<Link to='/saved-movies' className='nav-button'>
							Saved Movies
						</Link>
					</div>
				)}
			</nav>
		</header>
	);
};

export default Header;
