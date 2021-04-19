import React from 'react';
import {FaPlus} from "react-icons/fa";
import {StyledNote} from "./Note";

const NoteAdd = ({onClick}) => {
    return (
        <StyledNote onClick={onClick} title="add note">
            <span className="button brand">
                <FaPlus/>
            </span>
        </StyledNote>
    );
};

export default NoteAdd;
