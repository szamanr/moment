import React from "react";
import {FaPencilRuler, FaTimes, FaTrash} from "react-icons/fa";
import * as FirestoreService from "../services/firestore";

const FocusedLayout = ({element, type, close, remove, isNoteEditing, setIsNoteEditing, momentId}) => {
    /**
     * renders the focused element in a container corresponding to type
     *
     * @param element
     * @param type
     * @returns {*}
     */
    const renderFocusedElement = (element, type) => {
        const editableNote = (
            <div className="note">
                <div className="title">
                    <label htmlFor="title">title:</label><br/>
                    <input type="text" id="title" defaultValue={element.title} onChange={(e) => {
                        // TODO: debounce input
                        element.title = e.target.value;
                        FirestoreService.update(momentId, "notes", element);
                    }}/>
                </div>
                <div className="content">
                    <label htmlFor="content">content:</label>
                    <textarea id="content" value={element.content} onChange={(e) => {
                        element.content = e.target.value;
                        FirestoreService.update(momentId, "notes", element);
                    }}/>
                </div>
            </div>
        );


        switch (type) {
            case 'photos':
                return (
                    <img className="photo" src={element.src} alt={element.alt}/>
                );
            case 'notes':
                if (isNoteEditing) {
                    return editableNote;
                } else {
                    return (
                        <div className="note">
                            <h2 className="title">{element.title}</h2>
                            <p className="content" dangerouslySetInnerHTML={{__html: element.content}}/>
                        </div>
                    );
                }
            default:
                return;
        }
    }

    return (
        <main className="focused">
            <div id="focused-buttons" className="row">
                <div className="button danger" id="focused-element-remove"
                     onClick={remove}><span><FaTrash/></span></div>
                {type === "notes" ? <div className="button warning" id="focused-element-edit"
                                         onClick={() => {
                                             setIsNoteEditing((prev) => !prev);
                                         }}>
                    <span><FaPencilRuler/></span>
                </div> : null}
                <div className="button" id="focused-element-close"
                     onClick={close}><span><FaTimes/></span></div>
            </div>
            <div id="focused-element" className={"row focused-" + type}>
                {renderFocusedElement(element, type)}
            </div>
        </main>
    );
};

export default FocusedLayout;
