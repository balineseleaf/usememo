import { useState, useEffect, useCallback, useReducer } from 'react';
import './App.css';
import PersonList from './PersonList';
import { PersonModel, ResponseDto } from './models/Person';
import Todo from './Todo';

const BASE_URL = 'https://swapi.dev/api/people/';
const fetchPersons = async (page: number): Promise<ResponseDto> => {
	return fetch(`${BASE_URL}?page=${page}`).then((response) => response.json());
};

export const FORM_ACTIONS = {
	ADD_TODO: 'add-todo',
	TOGGLE_TODO: 'toggle-todo',
	DELETE_TODO: 'delete-todo',
};

function reducer(todos: any, action: any) {
	switch (action.type) {
		case FORM_ACTIONS.ADD_TODO:
			return [...todos, newTodo(action.payload.name)];

		case FORM_ACTIONS.TOGGLE_TODO:
			return todos.map((todo: any) => {
				if (todo.id === action.payload.id) {
					return { ...todo, complete: !todo.complete };
				}
				return todo;
			});

		case FORM_ACTIONS.DELETE_TODO:
			return todos.filter((todo: any) => todo.id !== action.payload.id);

		default:
			return todos;
	}
}

function newTodo(name: string) {
	return { id: Date.now(), name: name, complete: false };
}

function App(): JSX.Element {
	const [people, setPeople] = useState<PersonModel[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [maxCount, setMaxCount] = useState(Infinity);
	const [error, setError] = useState('');

	const [todos, dispatch] = useReducer(reducer, [{ name: 123 }]);
	const [name, setName] = useState('');

	const fetchNextPersons = async () => {
		const response = await fetchPersons(currentPage);
		if (!!response.count) {
			setMaxCount(response.count);
		}
		if (!!response.results && response.results.length > 0) {
			const newPeople: PersonModel[] = response.results.map((person: any) => ({
				...person,
				liked: localStorage.getItem(person.name) === 'true',
			}));
			setPeople((prevState) => [...prevState, ...newPeople]);
		}
	};

	useEffect(() => {
		if (people.length < maxCount) {
			setIsFetching(true);
			fetchNextPersons()
				.catch((e) => {
					setError(e);
				})
				.finally(() => {
					setIsFetching(false);
				});
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
		console.warn('scrollHandler');
		if (isFetching) return;
		const { scrollTop, scrollHeight, clientHeight } = (e.target as Document)
			.documentElement;
		if (scrollHeight - (scrollTop + clientHeight) < 100) {
			setCurrentPage((x) => x + 1);
		}
	};

	const debounce = (func: Function, waitTime: number) => {
		let timeout: any;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), waitTime);
		};
	};

	useEffect(() => {
		document.addEventListener('scroll', debounce(scrollHandler, 500));
		return function () {
			document.removeEventListener('scroll', scrollHandler);
		};
	}, []);

	if (error.length > 0) {
		return <p>{error}</p>;
	}

	function handleSubmitName(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		dispatch({ type: FORM_ACTIONS.ADD_TODO, payload: { name: name } });
		setName('');
	}

	return (
		<div className='gallery'>
			<form onSubmit={handleSubmitName}>
				<input
					type='text'
					value={name}
					onChange={(e) => setName(e.target.value)}></input>
			</form>
			<div className='todos'>
				{todos?.map((todo: any) => {
					return (
						<Todo
							key={todo.id}
							todo={todo}
							dispatch={dispatch}
						/>
					);
				})}
			</div>
			<PersonList
				people={people}
				onLikeToggle={handleLikeToggle}
			/>
		</div>
	);
}

export default App;
