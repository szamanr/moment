import React from "react";
import {FaPencilRuler, FaTimes, FaTrash} from "react-icons/fa";
import * as FirestoreService from "../services/firestore";
import EditableNote from "./EditableNote";
import {Row} from "../styled-components/containers";

const FocusedLayout = ({element, type, close, remove, isNoteEditing, setIsNoteEditing, momentId}) => {
    /**
     * renders the focused element in a container corresponding to type
     *
     * @param element
     * @param type
     * @returns {*}
     */
    const renderFocusedElement = (element, type) => {
        switch (type) {
            case 'photos':
                return (
                    <img className="photo" src={element.src} alt={element.alt}/>
                );
            case 'notes':
                if (isNoteEditing) {
                    return (
                        <EditableNote element={element} onChange={(e, field) => {
                            element[field] = e.target.value;
                            FirestoreService.update(momentId, "notes", element);
                        }}/>
                    );
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
            <Row id="focused-buttons">
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
            </Row>
            <Row id="focused-element" className={`focused-${type}`}>
                {renderFocusedElement(element, type)}
            </Row>
        </main>
    );
};

export default FocusedLayout;
