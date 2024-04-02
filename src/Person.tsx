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

// should we use this not to rerender every person, when only one is liked?
// https://react.dev/reference/react/memo

const Person: React.FC<PersonProps> = React.memo(({ person, onLikeToggle }) => {
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

	console.log("I am person", person.name)
	const calculateAge = useMemo(() => {
		console.log("I am person: calculateAge", person.name)
		for (let i=0; i<1_000_000; i++) { }
		const birthYear = person.birth_year;
		if (birthYear === 'unknown') return 'Unknown';
		const currentYear = new Date().getFullYear();
		let bbYear: number;

		// if-else is an anti-pattern. try to avoid it.
		// try to use ternary operator, it fits better here.
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
			Liked: {String(person.liked)}
			{/* <p className='text'>Birth Year: {calculateAge(person.birth_year)}</p> */}
			<button
				type='button'
				className={`like ${person.liked && 'like-active'}`}
				onClick={onLikeToggle}></button>
		</div>
	);
}, (oldProps, newProps)=>oldProps.person.liked !== newProps.person.liked);

export default Person;
