import { useState, useEffect, useCallback } from 'react';
import './App.css';
import PersonList from './PersonList';
import {PersonModel, ResponseDto} from './models/Person';

const BASE_URL = 'https://swapi.dev/api/people/'
const fetchPersons = async (page: number): Promise<ResponseDto> => {
	return fetch(`${BASE_URL}?page=${page}`).then(response => response.json())
}

function App(): JSX.Element {
	const [people, setPeople] = useState<PersonModel[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [maxCount, setMaxCount] = useState(Infinity)
	const [error, setError] = useState('')

	const fetchNextPersons = async () =>{
		const response = await fetchPersons(currentPage)
		if (!!response.count) {
			setMaxCount(response.count)
		}
		if (!!response.results && response.results.length > 0){
			const newPeople: PersonModel[] = response.results.map((person: any) => ({
				...person,
				liked: false,
			}))
			setPeople((prevState) => [...prevState, ...newPeople])
		}
	}

	useEffect(() => {
		if (people.length < maxCount){
			setIsFetching(true)
			fetchNextPersons()
				.catch(e=>{ setError(e) })
				.finally(()=>{ setIsFetching(false)})
		}
	}, [currentPage]);

	const handleLikeToggle = useCallback((person: PersonModel) => {
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
	}, []);

	const scrollHandler = (e: Event) => {
		console.warn("scrollHandler")
		if (isFetching) return
		const { scrollTop, scrollHeight, clientHeight } = (e.target as Document)
			.documentElement;
		if (scrollHeight - (scrollTop + clientHeight) < 100) {
			setCurrentPage(x=> x + 1);
		}
	};

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);
		return function () {
			document.removeEventListener('scroll', scrollHandler);
		};
	}, []);

	if (error.length>0){
		return <p>{error}</p>
	}

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
