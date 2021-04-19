import React from "react";
import "./Notes.css";
import {FaPlus} from "react-icons/fa";
import NoteProvider from "../providers/NoteProvider";

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
        <ul className="notes">
            {notesElement}
            {addNoteElement}
        </ul>
    );
};

export default Notes;
