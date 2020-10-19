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
                <FaPlus />
            </span>
        </li>
    );

    render() {
        const notes = this.props.notes.map((note, index) => {
            return (
                <li key={index} className="note" onClick={() => {
                    this.props.setFocused(note, index, 'notes')
                }}>
                    <span>{note.title}</span>
                </li>
            );
        });
        return (
            <ul className="notes">
                {notes}
                {this.addNoteElement}
            </ul>
        );
    }
}

export default Notes;
