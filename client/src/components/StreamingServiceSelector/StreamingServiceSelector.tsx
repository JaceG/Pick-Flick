import React, { useState } from 'react';

interface StreamingService {
	id: string;
	name: string;
}

interface StreamingServiceSelectorProps {
	onServiceSelect: (selectedServices: string[]) => void;
}

const StreamingServiceSelector: React.FC<StreamingServiceSelectorProps> = ({
	onServiceSelect,
}) => {
	const [selectedServices, setSelectedServices] = useState<string[]>([]);

	// Define available streaming services according to the documentation
	const streamingServices: StreamingService[] = [
		{ id: 'netflix', name: 'Netflix' },
		{ id: 'prime', name: 'Amazon Prime' },
		{ id: 'disney', name: 'Disney+' },
		{ id: 'hbo', name: 'HBO' },
		{ id: 'hulu', name: 'Hulu' },
		{ id: 'peacock', name: 'Peacock' },
		{ id: 'paramount', name: 'Paramount+' },
		{ id: 'apple', name: 'Apple TV' },
		{ id: 'mubi', name: 'Mubi' },
		{ id: 'showtime', name: 'Showtime' },
		{ id: 'starz', name: 'Starz' },
	];

	const toggleService = (serviceId: string) => {
		setSelectedServices((prevSelected) => {
			const newSelected = prevSelected.includes(serviceId)
				? prevSelected.filter((id) => id !== serviceId)
				: [...prevSelected, serviceId];
			onServiceSelect(newSelected);
			return newSelected;
		});
	};

	return (
		<div className='mt-4'>
			<h3 className='text-lg font-semibold mb-2'>
				Select Streaming Services:
			</h3>
			<div className='flex flex-wrap gap-4'>
				{streamingServices.map((service) => (
					<button
						key={service.id}
						onClick={() => toggleService(service.id)}
						className={`flex items-center p-2 border rounded-lg transition-colors ${
							selectedServices.includes(service.id)
								? 'bg-green-100 border-green-500'
								: 'bg-white border-gray-300'
						}`}>
						<span className='text-sm'>{service.name}</span>
						{selectedServices.includes(service.id) && (
							<svg
								className='w-4 h-4 ml-2 text-green-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M5 13l4 4L19 7'></path>
							</svg>
						)}
					</button>
				))}
			</div>
		</div>
	);
};

export default StreamingServiceSelector;
