import React from "react";
import "./Notes.css";
import {FaPlus} from "react-icons/fa";

class Notes extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.addNote = this.addNote.bind(this);
    }

    /**
     * adds a new dummy note
     */
    addNote = () => {
        const note = this.props.noteService.getRandomNote();
        this.props.addNote(note);
    }

    addNoteElement = (
        <li key="new" onClick={this.addNote} className="note note-add">
            <span className="button brand">
                <FaPlus/>
            </span>
        </li>
    );

    render() {
        const notesElement = this.props.notes.map((note) => {
            return (
                <li key={note.id} className="note" onClick={() => {
                    this.props.setFocused(note, note.id, 'notes')
                }}>
                    <span>{note.title}</span>
                </li>
            );
        });
        return (
            <ul className="notes">
                {notesElement}
                {this.addNoteElement}
            </ul>
        );
    }
}

export default Notes;
