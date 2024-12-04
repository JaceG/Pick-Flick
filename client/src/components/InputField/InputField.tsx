import React from 'react';

interface InputFieldProps {
	id: string;
	type: string;
	value: string;
	label: string;
	placeholder?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
	id,
	type,
	value,
	label,
	placeholder,
	onChange,
}) => {
	return (
		<div className='form-group'>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				className='input-field'
			/>
		</div>
	);
};

export default InputField;
