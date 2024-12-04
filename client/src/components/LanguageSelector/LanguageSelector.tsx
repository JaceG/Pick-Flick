import React from 'react';
import './LanguageSelector.css';

interface LanguageSelectorProps {
	selectedLanguage: string;
	setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
	languageOptions: { code: string; name: string }[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	selectedLanguage,
	setSelectedLanguage,
	languageOptions,
}) => {
	return (
		<div className='language-selector-container'>
			<label htmlFor='language-selector'>
				Preferred Language:
				<select
					id='language-selector'
					value={selectedLanguage}
					onChange={(e) => setSelectedLanguage(e.target.value)}>
					{languageOptions.map((language) => (
						<option key={language.code} value={language.code}>
							{language.name}
						</option>
					))}
				</select>
			</label>
		</div>
	);
};

export default LanguageSelector;
