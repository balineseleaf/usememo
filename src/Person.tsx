import React, { memo, useMemo } from 'react';
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
	const calculateAge = useMemo(() => {
		// console.log('I am person: calculateAge', person.name);
		for (let i = 0; i < 100_000_000; i++) {}
		const birthYear = person.birth_year;
		if (birthYear === 'unknown') return 'Unknown';
		const currentYear = new Date().getFullYear();

		return  birthYear.endsWith('BBY')
			? currentYear + parseInt(birthYear, 10)
			: parseInt(birthYear, 10);
	}, [person.birth_year]);

	return (
		<div className='person-info'>
			<p className='text bold-text'>Name: {person.name}</p>
			<p className='text'>Height: {person.height}</p>
			<p className='text'>Mass: {person.mass}</p>
			<p className='text'>Birth Year: {calculateAge}</p>
			Liked: {String(person.liked)}
			{/* <p className='text'>Birth Year: {calculateAge(person.birth_year)}</p> */}
			<button
				type='button'
				className={`like ${person.liked && 'like-active'}`}
				onClick={onLikeToggle}></button>
		</div>
	);
};

export default Person;
