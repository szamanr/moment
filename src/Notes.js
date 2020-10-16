import React from "react";
import "./Notes.css";

class Notes extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const notes = this.props.notes.map((note, index) => {
            return (
                <li key={index} className="notes-item" onClick={() => {
                    this.props.setFocused(note, index, 'notes')
                }}>
                    <span>{note.title}</span>
                </li>
            );
        });
        return (
            <ul id="notes">
                {notes}
            </ul>
        );
    }
}

export default Notes;
