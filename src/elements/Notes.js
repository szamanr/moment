import React from "react";
import NoteProvider from "../providers/NoteProvider";
import styled from "styled-components";
import Note from "./Note";
import NoteAdd from "./NoteAdd";

const StyledNotes = styled.ul`
  height: 100%;
  width: 100%;
  list-style-type: none;
  padding-left: 0;
`;

const Notes = ({addNote, notes, onClick}) => {

    /**
     * adds a new dummy note
     */
    const createNote = () => {
        const note = NoteProvider.getRandomNote();
        addNote(note);
    }

    return (
        <StyledNotes>
            {notes.map(note => <Note key={note.id} note={note} onClick={onClick.bind(null, note)}/>)}
            <NoteAdd key="new" onClick={createNote}/>
        </StyledNotes>
    );
};

export default Notes;
