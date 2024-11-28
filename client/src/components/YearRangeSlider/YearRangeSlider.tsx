import * as React from "react";

// Props interface defining the structure for year range slider
interface YearRangeSliderProps {
  yearRange: [number, number]; // Current min and max year range
  handleRangeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    range: [number, number],
    setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
    index: number
  ) => void; // Callback to handle range change
  setYearRange: React.Dispatch<React.SetStateAction<[number, number]>>; // State updater for year range
}

// Functional component for selecting a year range
const YearRangeSlider: React.FC<YearRangeSliderProps> = ({
  yearRange,
  handleRangeChange,
  setYearRange,
}) => {
  return (
    <div className="year-range-container">
      <label>
        Start Year:
        <input
          type="range" // Input type is a range slider
          min="1900"
          max="2024"
          value={yearRange[0]} // Bind to start year
          onChange={(e) => handleRangeChange(e, yearRange, setYearRange, 0)} // Update start year
        />
      </label>
      <label>
        End Year:
        <input
          type="range"
          min="1900"
          max="2024"
          value={yearRange[1]} // Bind to end year
          onChange={(e) => handleRangeChange(e, yearRange, setYearRange, 1)} // Update end year
        />
      </label>
      <div>
        {yearRange[0]} - {yearRange[1]} {/* Display year range */}
      </div>
    </div>
  );
};

export default YearRangeSlider; // Export the component for use in other files
