import React from 'react';
import YearRangeSlider from '../YearRangeSlider/YearRangeSlider';
import RuntimeRangeSlider from '../RuntimeRangeSlider/RuntimeRangeSlider';

interface SlidersProps {
	yearRange: [number, number];
	runtimeRange: [number, number];
	setYearRange: React.Dispatch<React.SetStateAction<[number, number]>>;
	setRuntimeRange: React.Dispatch<React.SetStateAction<[number, number]>>;
	handleRangeChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		range: [number, number],
		setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
		index: number
	) => void;
}

const Sliders: React.FC<SlidersProps> = ({
	yearRange,
	runtimeRange,
	setYearRange,
	setRuntimeRange,
	handleRangeChange,
}) => {
	return (
		<>
			<YearRangeSlider
				yearRange={yearRange}
				setYearRange={setYearRange}
				handleRangeChange={handleRangeChange}
			/>
			<RuntimeRangeSlider
				runtimeRange={runtimeRange}
				setRuntimeRange={setRuntimeRange}
				handleRangeChange={handleRangeChange}
			/>
		</>
	);
};

export default Sliders;
