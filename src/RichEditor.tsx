// @ts-nocheck

import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useImperativeHandle, useRef, forwardRef } from "react";
 function RichEditor ({ value, onChange, meWasFocusedByUser }, ref) {
     console.log(meWasFocusedByUser)
     const quillRef = useRef()
     useImperativeHandle(ref, ()=> ({
         focusMe: () => quillRef.current.focus()
     }), [])
     return(
        <div style={{marginTop: "20px"}}>
            <ReactQuill value={value} onChange={onChange} ref={quillRef} onFocus={meWasFocusedByUser}/>
        </div>
        )
}
export default forwardRef(RichEditor)

