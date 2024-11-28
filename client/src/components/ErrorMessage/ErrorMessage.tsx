import * as React from "react";

// Props interface to define the expected error message structure
interface ErrorMessageProps {
  error: string; // The error message to display
}

// Functional component to display an error message
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return <div className="error-message">{error}</div>; // Render the error message inside a div
};

export default ErrorMessage; // Export the component for use in other files
