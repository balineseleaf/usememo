import { FORM_ACTIONS } from './App';

interface TodoProps {
	todo: { id: number; name: string; complete: boolean };
	dispatch: React.Dispatch<{ type: string; payload: { id: number } }>;
}

const Todo: React.FC<TodoProps> = ({ todo, dispatch }) => {
	return (
		<div>
			<span style={{ color: todo.complete ? '#AAA' : '000' }}>{todo.name}</span>
			<button
				onClick={() =>
					dispatch({ type: FORM_ACTIONS.TOGGLE_TODO, payload: { id: todo.id } })
				}>
				Toggle
			</button>
			<button
				onClick={() =>
					dispatch({ type: FORM_ACTIONS.DELETE_TODO, payload: { id: todo.id } })
				}>
				Delete
			</button>
		</div>
	);
};

export default Todo;
