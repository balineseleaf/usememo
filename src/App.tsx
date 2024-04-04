import { useState, useEffect, useCallback } from 'react';
import './App.css';
import PersonList from './PersonList';
import PersonModel from './models/Person';

function App(): JSX.Element {
	const [people, setPeople] = useState<PersonModel[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isFetching, setIsFetching] = useState<boolean>(true);

	useEffect(() => {
		if (isFetching) {
			console.log('fetching');
			const fetchData = async () => {
				try {
					const response = await fetch(
						`https://swapi.dev/api/people/?page=${currentPage}`
					);
					if (!response.ok) {
						throw new Error('Failed to fetch data');
					}
					const data = await response.json();
					const newPeople: PersonModel[] = data.results.map((person: any) => ({
						...person,
						liked: false,
					}));
					newPeople.forEach((person) => {
						person.liked = Boolean(localStorage.getItem(person.name));
					});
					setPeople((prevPeople) => [...prevPeople, ...newPeople]);
					setCurrentPage((prev) => prev + 1);
					if (newPeople.length >= 82) {
						setIsFetching(false);
					}
				} catch (e) {
					return console.log(e);
				} finally {
					setIsFetching(false);
				}
			};
			fetchData();
		}
	}, [isFetching]);

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
			setIsFetching(true);
		}
	};

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);
		console.log('scroll');
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
