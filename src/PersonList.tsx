import React, { memo } from 'react';
import Person from './Person';
import './PersonList.css';
import { PersonModel } from './models/Person';

interface PersonListProps {
	people: PersonModel[];
	onLikeToggle: (person: PersonModel) => void;
}

const PersonList: React.FC<PersonListProps> = memo(
	({ people, onLikeToggle }) => {
		return (
			<div className='list'>
				{people.map((person, index) => (
					<Person
						key={index}
						person={person}
						onLikeToggle={() => onLikeToggle(person)}
					/>
				))}
			</div>
		);
	}
);

export default PersonList;
