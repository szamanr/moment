import React from "react";
import "./Notes.css";
import Faker from 'faker';

class Notes extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {notes: []};
    }

    componentDidMount() {
        let notes = [];

        for(let i = 0; i < 20; i++) {
            notes.push({
                title: Faker.lorem.words(),
                content: Faker.lorem.sentences(10),
            });
        }

        this.setState({
            notes: notes
        });
    }

    render() {
        const notes = this.state.notes.map((note, index) => {
            return (
                <li key={index} className="notes-item" onClick={() => {
                    this.props.setFocused(note, index, 'note')
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
