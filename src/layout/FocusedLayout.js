import React, {useState} from "react";
import {FaPencilRuler, FaTimes, FaTrash} from "react-icons/fa";
import * as FirestoreService from "../services/firestore";
import EditableNote from "./EditableNote";
import {Row} from "../styled-components/containers";
import {FocusedMomentContainer} from "../styled-components/MomentContainer";
import {useHistory, useParams} from "react-router-dom";

const FocusedLayout = ({focused, setFocused}) => {
    const {momentId} = useParams();
    const {focusedElementId} = useParams();
    const history = useHistory();

    const [isNoteEditing, setIsNoteEditing] = useState(false);

    /**
     * renders the focused element in a container corresponding to type
     *
     * @returns {*}
     */
    const renderFocusedElement = () => {
        switch (focused.type) {
            case 'photos':
                return (
                    <img className="photo" src={focused.element.src} alt={focused.element.alt}/>
                );
            case 'notes':
                if (isNoteEditing) {
                    return (
                        <EditableNote element={focused.element} onChange={(e, field) => {
                            focused.element[field] = e.target.value;
                            FirestoreService.update(momentId, "notes", focused.element);
                        }}/>
                    );
                } else {
                    return (
                        <div className="note">
                            <h2 className="title">{focused.element.title}</h2>
                            <p className="content" dangerouslySetInnerHTML={{__html: focused.element.content}}/>
                        </div>
                    );
                }
            default:
                return;
        }
    }

    /**
     * closes the focused view
     */
    const close = () => {
        setFocused(null);
        history.push(`/moment/${momentId}`);
    }

    /**
     * removes the element currently in focus from the db. in case of photo, also removes the stored image.
     */
    const remove = () => {
        if (focused.type === 'photos') {
            FirestoreService.removeFromStorage(momentId, focusedElementId).then(() => {
                console.debug('photo deleted from storage.');
            });
        }

        FirestoreService.remove(momentId, focused.type, focusedElementId).then(() => {
            console.debug('item removed from db.');
        });

        close();
    }

    return (
        <FocusedMomentContainer>
            <Row id="focused-buttons">
                <div className="button danger" id="focused-element-remove"
                     onClick={remove}><span><FaTrash/></span></div>
                {focused.type === "notes" ?
                    <div className="button warning" id="focused-element-edit" onClick={() => {
                        setIsNoteEditing((prev) => !prev);
                    }}>
                        <span><FaPencilRuler/></span>
                    </div> : null}
                <div className="button" id="focused-element-close"
                     onClick={close}><span><FaTimes/></span></div>
            </Row>
            <Row id="focused-element" className={`focused-${focused.type}`}>
                {renderFocusedElement(focused.element, focused.type)}
            </Row>
        </FocusedMomentContainer>
    );
};

export default FocusedLayout;
