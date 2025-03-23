import { useRef, useState } from 'react';
import { Pencil } from "lucide-react";
import './Editable.css';


const Editable = ({title,value,div_width,div_height,backgroundColor,textColor}) =>{

    const [isEditable,setEditable] = useState(false);
    const [text,setValue] = useState(value);
    const inputRef = useRef(null);

    function toggleEditMode(){
        setEditable(true);
        inputRef.current.focus();
    }

    return(
        <div className="editable" style={{
            width:div_width,
            height:div_height,
            backgroundColor:backgroundColor
        }}>
                <textarea className='editable-input'
                    style={{
                        color:textColor,
                        width:"85%",
                        height:'80%',
                        margin: "auto 0px",
                        background: "none",
                        border: "none",
                        resize:"none",
                    }}
                    placeholder='Add a Description for Yo'
                    ref={inputRef}
                    value={text} 
                    readOnly={!isEditable}
                    onBlur={()=>setEditable(false)}
                    onChange={(e)=>{setValue(e.target.value)}}></textarea>
            {!isEditable &&(
                <button className='edit-btn' onClick={toggleEditMode} title={title}><Pencil className='edit-icon' style={{color:textColor}}/></button>
            )}
        </div>
    );
}

export default Editable;