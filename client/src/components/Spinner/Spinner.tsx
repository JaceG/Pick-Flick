import React from 'react';
import './Spinner.css';

const Spinner: React.FC = () => {
	return (
		<div className='loading-spinner'>
			<div className='loading-circle'></div>
			<div className='loading-circle'></div>
			<div className='loading-circle'></div>
		</div>
	);
};

export default Spinner;
