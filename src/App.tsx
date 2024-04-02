import {useState, useEffect, useCallback} from 'react';
import './App.css';
// it's not obvious to use axios, why not just simple fetch?
import axios from 'axios';
import PersonList from './PersonList';
import PersonModel from './models/Person';

function App(): JSX.Element { // types in this line are redundant
	// try to use only 2 state variables: people and currentPage. fetching and allFetched are redundant
	const [people, setPeople] = useState<PersonModel[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [fetching, setFetching] = useState<boolean>(true);
	// 1. here we are duplicating the state. allFetched can be calculated from people.length
	// 2. boolean variables are better to name like "isFetchedAll" or "areAllFetched"
	const [allFetched, setAllFetched] = useState<boolean>(false);

	const [toggle, setToggle] = useState(false)

	useEffect(() => {
		console.warn("I am useEffect", new Date().getMilliseconds())
		if (fetching && !allFetched) {
			console.warn('fetching');
			axios
				// here we can use generic types
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
						// how do you know, that the number of people is 82?
						// maybe it's better to get this from the server?
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
		// comparing two peoples you rely on url, but as key in local storage you are using name
		// this can lead to hard2debug issues in the future.
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
			<button onClick={()=>setToggle(!toggle)}>Toggle</button>
			<PersonList
				people={people}
				onLikeToggle={handleLikeToggle}
			/>
		</div>
	);
}

export default App;
