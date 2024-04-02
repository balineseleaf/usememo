import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import PersonList from './PersonList';
import PersonModel from './models/Person';

function App(): JSX.Element {
	const [people, setPeople] = useState<PersonModel[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [fetching, setFetching] = useState<boolean>(true);
	const [allFetched, setAllFetched] = useState<boolean>(false);

	useEffect(() => {
		if (fetching && !allFetched) {
			console.log('fetching');
			axios
				.get(`https://swapi.dev/api/people/?page=${currentPage}`)
				.then((res) => {
					if (res.status === 200) {
						const newPeople: PersonModel[] = res.data.results.map(
							(person: any) => ({
								...person,
								liked: false,
							})
						);
						newPeople.forEach((person) => {
							person.liked = Boolean(localStorage.getItem(person.name));
						});
						setPeople((prevPeople) => [...prevPeople, ...newPeople]);
						setCurrentPage((prev) => prev + 1);
						if (people.length >= 82) {
							setAllFetched(true);
						}
					}
				})
				.catch((error) => console.log(error))
				.finally(() => setFetching(false));
		}
	}, [fetching, allFetched]);

	const handleLikeToggle = (person: PersonModel) => {
		const isLiked = !person.liked;
		setPeople((prevCharacter) =>
			prevCharacter.map((character) =>
				character.url === person.url
					? { ...character, liked: isLiked }
					: character
			)
		);
		if (isLiked) {
			localStorage.setItem(person.name, String(isLiked));
		} else {
			localStorage.removeItem(person.name);
		}
	};

	const scrollHandler = (e: Event) => {
		const { scrollTop, scrollHeight, clientHeight } = (e.target as Document)
			.documentElement;
		if (scrollHeight - (scrollTop + clientHeight) < 100) {
			setFetching(true);
		}
	};

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);
		return function () {
			document.removeEventListener('scroll', scrollHandler);
		};
	}, []);

	return (
		<div className='gallery'>
			<PersonList
				people={people}
				onLikeToggle={handleLikeToggle}
			/>
		</div>
	);
}

export default App;
