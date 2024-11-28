import * as React from "react";

// Props interface defining the structure for runtime range slider
interface RuntimeRangeSliderProps {
  runtimeRange: [number, number]; // Current min and max runtime
  handleRangeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    range: [number, number],
    setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
    index: number
  ) => void; // Callback to handle range change
  setRuntimeRange: React.Dispatch<React.SetStateAction<[number, number]>>; // State updater for runtime range
}

// Functional component for selecting a runtime range
const RuntimeRangeSlider: React.FC<RuntimeRangeSliderProps> = ({
  runtimeRange,
  handleRangeChange,
  setRuntimeRange,
}) => {
  return (
    <div className="runtime-range-container">
      <label>
        Min Runtime (minutes):
        <input
          type="range" // Input type is a range slider
          min="0"
          max="360"
          step="10" // Slider moves in steps of 10 minutes
          value={runtimeRange[0]} // Bind to minimum runtime value
          onChange={(e) => handleRangeChange(e, runtimeRange, setRuntimeRange, 0)} // Update min runtime
        />
      </label>
      <label>
        Max Runtime (minutes):
        <input
          type="range"
          min="0"
          max="360"
          step="10"
          value={runtimeRange[1]} // Bind to maximum runtime value
          onChange={(e) => handleRangeChange(e, runtimeRange, setRuntimeRange, 1)} // Update max runtime
        />
      </label>
      <div>
        {Math.floor(runtimeRange[0] / 60)}h {runtimeRange[0] % 60}m -{" "}
        {Math.floor(runtimeRange[1] / 60)}h {runtimeRange[1] % 60}m {/* Display range in hours and minutes */}
      </div>
    </div>
  );
};

export default RuntimeRangeSlider; // Export the component for use in other files
