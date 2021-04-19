import React from "react";
import {FaPlus} from "react-icons/fa";
import NoteProvider from "../providers/NoteProvider";
import styled from "styled-components";
import Note from "./Note";

const Container = styled.ul`
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

    const addNoteElement = (
        <li key="new" onClick={createNote} className="note note-add" title="add note">
            <span className="button brand">
                <FaPlus/>
            </span>
        </li>
    );

    const notesElement = notes.map((note) => {
        return (
            <li key={note.id} className="note" onClick={onClick.bind(null, note)}>
                <span>{note.title}</span>
            </li>
        );
    });

    return (
        <Container>
            {notes.map(note => <Note key={note.id} note={note} onClick={onClick.bind(null, note)}/>)}
            {addNoteElement}
        </Container>
    );
};

export default Notes;
