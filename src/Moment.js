import React, {useEffect, useRef, useState} from 'react';
import {useParams, withRouter} from 'react-router-dom';
import './Moment.css';
import Notes from "./Notes";
import Photos from "./Photos";
import './global.css';
import {FaPencilRuler, FaTimes, FaTrash} from 'react-icons/fa';
import * as FirestoreService from "./services/firestore";
import * as LocalStorageService from "./services/localStorage";

function Moment() {
    const {momentId} = useParams();

    const [focusedElement, setFocusedElement] = useState(null);
    const [focusedElementId, setFocusedElementId] = useState(null);
    const [focusedElementType, setFocusedElementType] = useState(null);
    const [photos, setPhotos] = useState(new Map());
    const [notes, setNotes] = useState(new Map());
    const [layout, setLayout] = useState([]);

    // set flag when uploading photo, so we can display it when upload is finished
    const [isPhotoUploading, setIsPhotoUploading] = useState(false);
    // flag for note editing mode
    const [isNoteEditing, setIsNoteEditing] = useState(false);

    // mark component as mounted so we don't set any states after unmount
    const isComponentMounted = useRef(true);
    useEffect(() => {
        return function whenUnmounted() {
            isComponentMounted.current = false;
        }
    }, []);

    // fetch layout
    useEffect(() => {
        FirestoreService.getMoment(momentId).then((moment) => {
            setLayout(moment.get('layout'));
        });
    }, [momentId]);

    // subscribe to photos
    useEffect(() => {
        console.debug('streaming photos...');//
        const cleanup = FirestoreService.streamPhotos(momentId, (snapshot) => {
            const items = new Map();
            snapshot.docs.forEach((documentSnapshot) => {
                const id = documentSnapshot.id;
                const item = {
                    id: id,
                    alt: documentSnapshot.data().alt,
                    src: LocalStorageService.getPhoto(id),
                };

                items.set(id, item);
            });

            setPhotos(items);
        });

        return function photosUnsubscribe() {
            cleanup();
        };
    }, [momentId]);

    // fetch images from storage
    // TODO: after image added, 12 requests are sent. check why so many.
    useEffect(() => {
        for (const photo of photos.values()) {
            const src = LocalStorageService.getPhoto(photo.id);
            if (src) {
                photo.src = src;
                continue;
            }

            console.debug('fetching image for photo ' + photo.id);//

            FirestoreService.getStorageItem(momentId, photo.id)
                .then((url) => {
                    photo.src = url;

                    // cache it
                    if (isComponentMounted.current) {
                        console.debug('updating cache...');//
                        LocalStorageService.setPhoto(photo);
                    }

                    setPhotos(photos);
                }, (error) => {
                    if (photo.src) {
                        // file could not be downloaded
                        console.error(error);
                    } else {
                        // file is still being uploaded, download will try again
                    }

                    return null;
                });
        }
    }, [momentId, photos, isPhotoUploading]);

    // subscribe to notes
    useEffect(() => {
        const cleanup = FirestoreService.streamNotes(momentId, (snapshot) => {
            let items = new Map();

            snapshot.forEach((documentSnapshot) => {
                const item = documentSnapshot.data();

                items.set(documentSnapshot.id, {
                    id: documentSnapshot.id,
                    title: item.title,
                    content: item.content,
                })
            });

            setNotes(items);
        });

        return function notesUnsubscribe() {
            cleanup();
        }
    }, [momentId]);

    // TODO: remove. this is just to test if the layout can be modified dynamically.
    /*useEffect(() => {
        setTimeout(() => {
            setLayout([
                {
                    className: 'row',
                    components: [
                        '[map]',
                        'Notes',
                        '[player]'
                    ]
                },
                {
                    className: 'row double',
                    components: [
                        'Photos'
                    ]
                },
            ]);
        }, 5000);
    });*/

    /**
     * sets the chosen element to be focused, i.e. displayed as the only element in the main view
     *
     * @param element
     * @param id
     * @param type
     */
    const setFocused = function (element = null, id = null, type = null) {
        setFocusedElement(element);
        setFocusedElementId(id);
        setFocusedElementType(type);
    }

    /**
     * uploads a photo to the storage and adds it to db
     *
     * @param files
     * @param metadata
     */
    const addPhoto = function (files, metadata = null) {
        for (const file of files) {
            const ref = FirestoreService.add(momentId, 'photos', {src: file.name, alt: file.name});

            setIsPhotoUploading(true);

            FirestoreService.upload(momentId, ref.id, file, metadata)
                .then((imageRef) => {
                    ref.update({
                        storage: imageRef.fullPath
                    });

                    setIsPhotoUploading(false);
                });
        }
    }

    /**
     * removes an element with a given id from a given collection
     *
     * @param collection
     * @param id
     */
    const remove = function (collection, id) {
        if (collection === 'photos') {
            FirestoreService.removeFromStorage(momentId, id).then(() => {
                console.log('photo deleted from storage.');
            });
        }

        FirestoreService.remove(momentId, collection, id).then(() => {
            console.log('item removed from db.');
        });
    }

    /**
     * removes the focused photo from the list
     */
    const removeFocusedElement = function () {
        if (focusedElementId === null || focusedElementType === null) {
            return;
        }

        remove(focusedElementType, focusedElementId);
        setFocused();
    }

    /**
     * initialises a component based on its name.
     *
     * @param componentName
     * @returns {*}
     */
    const initComponent = function (componentName) {
        switch (componentName) {
            case ('Photos'):
                return (
                    <Photos photos={Array.from(photos.values())} onClick={setFocused} addPhoto={addPhoto}/>
                );
            case ('Notes'):
                return (
                    <Notes notes={Array.from(notes.values())} addNote={(note) => {
                        FirestoreService.add(momentId, 'notes', note)
                    }} onClick={setFocused}/>
                );
            default:
                return componentName;
        }
    }

    /**
     * renders the focused element in a container corresponding to type
     *
     * @param element
     * @param type
     * @returns {*}
     */
    const renderFocusedElement = function (element, type) {
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

    // focused view - only display the focused element, stretched to fill full component size
    if (focusedElement) {
        return (
            <main className="focused">
                <div id="focused-buttons" className="row">
                    <div className="button danger" id="focused-element-remove"
                         onClick={removeFocusedElement}><span><FaTrash/></span></div>
                    {focusedElementType === "notes" ? <div className="button warning" id="focused-element-edit"
                          onClick={() => {
                              setIsNoteEditing((prev) => !prev);
                          }}>
                        <span><FaPencilRuler/></span>
                    </div> : null}
                    <div className="button" id="focused-element-close"
                         onClick={() => {
                             setFocused()
                         }}><span><FaTimes/></span></div>
                </div>
                <div id="focused-element" className={"row focused-" + focusedElementType}>
                    {renderFocusedElement(focusedElement, focusedElementType)}
                </div>
            </main>
        );
    }

    // not in focused view — display all component based on layout
    return (
        <main>
            {layout.map((row, index) => {
                return (
                    <div className={row.className} key={index}>
                        {row.components.map((component, index) => {
                            return (
                                <div className="box" key={index}>
                                    {initComponent(component)}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </main>
    );
}

export default withRouter(Moment);
