import React from "react";
import "./Notes.css";

class Notes extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {notes: []};
    }

    componentDidMount() {
        this.setState({
            notes: [
                {
                    title: 'plan 16.10.2020',
                    content: 'Commodi sint qui non aliquid. Consequuntur voluptate qui atque voluptatem ad distinctio. Cupiditate distinctio et et corrupti sit consequatur. Facere cumque impedit qui. Perspiciatis tempore dolore qui quidem aspernatur sed reprehenderit dolores. Distinctio vero iure earum iusto minus in ipsum a.'
                },
                {
                    title: 'plan 17.10.2020',
                    content: 'Hic consequatur velit eum perspiciatis cumque corporis reiciendis. Aut consectetur aliquid dicta reprehenderit aperiam quia mollitia nam. Sint sint rerum quasi omnis in doloribus alias minima. Cumque eius et numquam ipsam molestiae eum recusandae.'
                },
                {
                    title: 'quotes',
                    content: "Consequuntur recusandae cum perspiciatis<br/>minima. Ut ea voluptatem vero temporibus<br/>et magnam. Est necessitatibus voluptatem ex rerum. Temporibus est dignissimos qui veritatis"
                },
                {
                    title: '$$$ list',
                    content: 'Dolores perspiciatis illum'
                },
            ]
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
