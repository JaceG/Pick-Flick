import React from 'react';
import './YearRangeSlider.css';

interface YearRangeSliderProps {
	yearRange: [number, number]; // Current year range values
	setYearRange: React.Dispatch<React.SetStateAction<[number, number]>>; // Function to update year range
	handleRangeChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		range: [number, number],
		setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
		index: number
	) => void; // Function to handle changes in the range sliders
}

const YearRangeSlider: React.FC<YearRangeSliderProps> = ({
	yearRange,
	setYearRange,
	handleRangeChange,
}) => {
	return (
		<div className='year-range-container'>
			<label className='start-year-label'>
				Start Year:
				<input
					type='range'
					min='1900'
					max='2024'
					value={yearRange[0]}
					onChange={(e) =>
						handleRangeChange(e, yearRange, setYearRange, 0)
					}
					aria-label='Start year'
					className='start-year-slider'
				/>
			</label>
			<label className='end-year-label'>
				End Year:
				<input
					type='range'
					min='1900'
					max='2024'
					value={yearRange[1]}
					onChange={(e) =>
						handleRangeChange(e, yearRange, setYearRange, 1)
					}
					aria-label='End year'
					className='end-year-slider'
				/>
			</label>
			<div>
				{yearRange[0]} - {yearRange[1]}
			</div>
		</div>
	);
};

export default YearRangeSlider;
