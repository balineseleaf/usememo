import React, { useMemo } from 'react';
import './Person.css';

interface PersonProps {
	person: {
		name: string;
		height: string;
		mass: string;
		birth_year: string;
		liked?: boolean;
	};
	onLikeToggle: () => void;
}

const Person: React.FC<PersonProps> = ({ person, onLikeToggle }) => {
	// const calculateAge = (birthYear: string): string | number => {
	// 	if (birthYear === 'unknown') return 'Unknown';
	// 	const currentYear = new Date().getFullYear();
	// 	let bbYear: number;

	// 	for (let i = 1; i < 100000000; i++) {
	// 		bbYear = 2 + i;
	// 	}
	// 	if (birthYear.endsWith('BBY')) {
	// 		bbYear = currentYear + parseInt(birthYear, 10);
	// 	} else {
	// 		bbYear = parseInt(birthYear, 10);
	// 	}
	// 	return bbYear;
	// };

	const calculateAge = useMemo(() => {
		const birthYear = person.birth_year;
		if (birthYear === 'unknown') return 'Unknown';
		const currentYear = new Date().getFullYear();
		let bbYear: number;

		if (birthYear.endsWith('BBY')) {
			bbYear = currentYear + parseInt(birthYear, 10);
		} else {
			bbYear = parseInt(birthYear, 10);
		}
		return bbYear;
	}, [person.birth_year]);

	return (
		<div className='person-info'>
			<p className='text bold-text'>Name: {person.name}</p>
			<p className='text'>Height: {person.height}</p>
			<p className='text'>Mass: {person.mass}</p>
			<p className='text'>Birth Year: {calculateAge}</p>
			{/* <p className='text'>Birth Year: {calculateAge(person.birth_year)}</p> */}
			<button
				type='button'
				className={`like ${person.liked && 'like-active'}`}
				onClick={onLikeToggle}></button>
		</div>
	);
};

export default Person;
