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
        const notes = this.props.notes;
        const notesElement = Object.keys(notes).map((index) => {
            return (
                <li key={index} className="note" onClick={() => {
                    this.props.setFocused(notes[index], index, 'notes')
                }}>
                    <span>{notes[index].title}</span>
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
