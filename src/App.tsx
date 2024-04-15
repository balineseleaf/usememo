import './App.css';
import {MutableRefObject, useEffect, useRef, useState} from "react";
import RichEditor from "./RichEditor";

function App(){
	const [toggle, setToggle] = useState(false)

	const firstName = useRef('')
	const lastName = useRef('')

	const [activeIdx, setActiveIdx] = useState(0)
	const firstNameInput = useRef({focusMe: ()=> { throw new Error("Not implemented") }})
	const lastNameInput = useRef({focusMe: ()=> { throw new Error("Not implemented") }})

	const changeHandler = (ref: MutableRefObject<string>, value:string)=>{
		ref.current = value
	}

	const keyHandler = (event: KeyboardEvent)=> {
		if (event.key!=='Tab') return;
		event.preventDefault()
		if (event.shiftKey) {
			setActiveIdx(0)
		} else {
			setActiveIdx(1)
		}
	}
	useEffect(() => {
		switch (activeIdx) {
			case 0 :
				firstNameInput.current.focusMe()
				break
			case 1:
				lastNameInput.current.focusMe()
				break
			default:
				throw new Error("Unexpected state")
		}
	}, [activeIdx]);

	useEffect(() => {
		document.addEventListener("keydown", keyHandler)
		return () => document.removeEventListener("keydown", keyHandler)
	}, []);

	return (
		<div style={{display:'flex', flexDirection: "column", padding: "100px 200px", height: '100px', justifyContent: 'space-between'}}>
			<div>
				ActiveIdx: {activeIdx}
				Toggle: {String(toggle)}
				<button onClick={() => {
					setToggle((x) => !x)
					firstNameInput.current.focusMe()
				}}>Toggle1
				</button>
				<button onClick={() => {
					setToggle((x) => !x)
					lastNameInput.current.focusMe()
				}}>Toggle2
				</button>
			</div>
			<RichEditor
				value={firstName.current}
				onChange={(value: string) => changeHandler(firstName, value)}
				ref={firstNameInput}
				meWasFocusedByUser={()=> setActiveIdx(0)} />
			<RichEditor
				value={lastName.current}
				onChange={(value:string) => changeHandler(lastName, value)}
				ref={lastNameInput}
				meWasFocusedByUser={()=> setActiveIdx(1)}/>
			<button onClick={()=>{
				console.warn("firstName", firstName.current)
				console.warn("lastName", lastName.current)
			}}>Save</button>
		</div>)

}

export default App;
