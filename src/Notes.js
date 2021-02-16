import React from "react";
import "./Notes.css";
import {FaPlus} from "react-icons/fa";
import NoteProvider from "./providers/NoteProvider";

function Notes(props) {

    /**
     * adds a new dummy note
     */
    const addNote = () => {
        const note = NoteProvider.getRandomNote();
        props.addNote(note);
    }

    const addNoteElement = (
        <li key="new" onClick={addNote} className="note note-add" title="add note">
            <span className="button brand">
                <FaPlus/>
            </span>
        </li>
    );

    const notesElement = props.notes.map((note) => {
        return (
            <li key={note.id} className="note" onClick={props.onClick.bind(null, note)}>
                <span>{note.title}</span>
            </li>
        );
    });

    return (
        <ul className="notes">
            {notesElement}
            {addNoteElement}
        </ul>
    );
}

export default Notes;
