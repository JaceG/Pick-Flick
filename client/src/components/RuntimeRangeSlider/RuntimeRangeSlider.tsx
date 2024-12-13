import React from 'react';
import './RuntimeRangeSlider.css';

interface RuntimeRangeSliderProps {
	runtimeRange: [number, number];
	setRuntimeRange: React.Dispatch<React.SetStateAction<[number, number]>>;
	handleRangeChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		range: [number, number],
		setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
		index: number
	) => void;
}

const RuntimeRangeSlider: React.FC<RuntimeRangeSliderProps> = ({
	runtimeRange,
	setRuntimeRange,
	handleRangeChange,
}) => {
	return (
		<div className='runtime-range-container'>
			<label className='min-runtime-label'>
				Min Runtime (minutes):
				<input
					type='range'
					min='0'
					max='360'
					step='10'
					value={runtimeRange[0]}
					onChange={(e) =>
						handleRangeChange(e, runtimeRange, setRuntimeRange, 0)
					}
					className='min-runtime-slider'
				/>
			</label>
			<label className='max-runtime-label'>
				Max Runtime (minutes):
				<input
					type='range'
					min='0'
					max='360'
					step='10'
					value={runtimeRange[1]}
					onChange={(e) =>
						handleRangeChange(e, runtimeRange, setRuntimeRange, 1)
					}
					className='max-runtime-slider'
				/>
			</label>
			<div>
				{Math.floor(runtimeRange[0] / 60)}h {runtimeRange[0] % 60}m -{' '}
				{Math.floor(runtimeRange[1] / 60)}h {runtimeRange[1] % 60}m
			</div>
		</div>
	);
};

export default RuntimeRangeSlider;
