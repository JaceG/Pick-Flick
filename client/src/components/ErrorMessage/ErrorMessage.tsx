import React from 'react';

// Props interface to define the expected error message structure
interface ErrorMessageProps {
	message: string; // The error message to display
}

// Functional component to display an error message
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
	return <div className='error-message'>{message}</div>; // Render the error message inside a div
};

export default ErrorMessage;
