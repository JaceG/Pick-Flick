import * as React from "react";

// Props interface defining the structure of the language selector component
interface LanguageSelectorProps {
  selectedLanguage: string; // Currently selected language
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>; // State updater for the selected language
  languageOptions: { code: string; name: string }[]; // Array of available language options
}

// Functional component for selecting a preferred language
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  languageOptions,
}) => {
  return (
    <div className="language-selector-container">
      <label>
        Preferred Language:
        <select
          value={selectedLanguage} // Bind the selected value to state
          onChange={(e) => setSelectedLanguage(e.target.value)} // Update state on change
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name} {/* Display language name */}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default LanguageSelector; // Export the component for use in other files
