import { useRef, useState } from 'react';
import { Pencil } from "lucide-react";
import './Editable.css';

const Editable = ({title,value,type='',div_width,div_height,backgroundColor,textColor}) =>{

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
            backgroundColor:backgroundColor,
        }}>
                <input className='editable-input'
                    style={{
                        color:textColor
                    }}
                    ref={inputRef}
                    type={type} 
                    value={text} 
                    readOnly={!isEditable}
                    onBlur={()=>setEditable(false)}
                    onChange={(e)=>{setValue(e.target.value)}}>
                </input>
            {!isEditable &&(
                <button onClick={toggleEditMode} title={title}><Pencil className='edit-icon' style={{color:textColor}}/></button>
            )}
        </div>
    );
}

export default Editable;