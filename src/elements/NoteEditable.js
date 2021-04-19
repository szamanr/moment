const NoteEditable = ({element, onChange}) => {
    return (
        <div className="note">
            <div className="title">
                <label htmlFor="title">title:</label><br/>
                <input type="text" id="title" defaultValue={element.title} onChange={onChange.bind(null, 'title')}/>
            </div>
            <div className="content">
                <label htmlFor="content">content:</label>
                <textarea id="content" defaultValue={element.content} onChange={onChange.bind(null, 'content')}/>
            </div>
        </div>
    );
};

export default NoteEditable;
