import React, {useContext, useEffect, useState} from "react";
import {FaPencilRuler, FaTimes, FaTrash} from "react-icons/fa";
import * as FirestoreService from "./services/firestore";
import {parseNote, parsePhoto} from "./services/firestore";
import EditableNote from "./layout/EditableNote";
import {FocusedContainer} from "./styled-components/MomentContainer";
import {useHistory, useParams} from "react-router-dom";
import Row, {FocusedRow} from "./styled-components/Row";
import {FirestoreContext} from "./App";
import Spinner from "./layout/Spinner";

const FocusedElement = ({focused, setFocused}) => {
    const {momentId} = useParams();
    const {focusedElementType} = useParams();
    const {focusedElementId} = useParams();
    const history = useHistory();

    const [isNoteEditing, setIsNoteEditing] = useState(false);

    const db = useContext(FirestoreContext);

    useEffect(() => {
        (async () => {
            if (!focused) {
                const doc = await db.collection('moments').doc(momentId).collection(focusedElementType)
                    .doc(focusedElementId)
                    .get();
                let item;
                switch (focusedElementType) {
                    case 'photos':
                        ({item} = parsePhoto(doc));
                        break;
                    case 'notes':
                        ({item} = parseNote(doc));
                        break;
                }
                setFocused(item);
            }
        })();
    }, [db, focused, focusedElementId, focusedElementType, momentId, setFocused]);

    if (!focused) {
        return <Spinner size="fit"/>;
    }

    /**
     * renders the focused element in a container corresponding to type
     *
     * @returns {*}
     */
    const renderFocusedElement = () => {
        switch (focusedElementType) {
            case 'photos':
                return (
                    <img className="photo" src={focused.src} alt={focused.alt}/>
                );
            case 'notes':
                if (isNoteEditing) {
                    return (
                        <EditableNote element={focused} onChange={(field, e) => {
                            focused[field] = e.target.value;
                            FirestoreService.update(momentId, "notes", focused);
                        }}/>
                    );
                } else {
                    return (
                        <div className="note">
                            <h2 className="title">{focused.title}</h2>
                            <p className="content" dangerouslySetInnerHTML={{__html: focused.content}}/>
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
        if (focusedElementType === 'photos') {
            FirestoreService.removeFromStorage(momentId, focusedElementId).then(() => {
                console.debug('photo deleted from storage.');
            });
        }

        FirestoreService.remove(momentId, focusedElementType, focusedElementId).then(() => {
            console.debug('item removed from db.');
        });

        close();
    }

    /**
     * toggles note editing mode
     */
    const toggleNoteEdit = () => {
        setIsNoteEditing((prev) => !prev);
    };

    return (
        <FocusedContainer>
            <Row id="focused-buttons">
                <div className="button danger" id="focused-element-remove"
                     onClick={remove}><span><FaTrash/></span></div>
                {focusedElementType === "notes" ?
                    <div className="button warning" id="focused-element-edit" onClick={toggleNoteEdit}>
                        <span><FaPencilRuler/></span>
                    </div> : null}
                <div className="button" id="focused-element-close"
                     onClick={close}><span><FaTimes/></span></div>
            </Row>
            <FocusedRow type={focusedElementType}>
                {renderFocusedElement()}
            </FocusedRow>
        </FocusedContainer>
    );
};

export default FocusedElement;
