import React, {useEffect, useRef, useState} from 'react';
import './Moment.css';
import Header from "./Header";
import Notes from "./Notes";
import Photos from "./Photos";
import './global.css';
import {FaTimes, FaTrash} from 'react-icons/fa';
import {withRouter} from "react-router-dom";
import * as FirestoreService from "./services/firestore";
import * as LocalStorageService from "./services/localStorage";

function Moment(props) {
    const defaultLayout = [
        {
            className: 'row double',
            components: [
                'Photos'
            ]
        },
        {
            className: 'row',
            components: [
                '[map]',
                'Notes',
                '[player]'
            ]
        },
    ];

    // TODO: use custom hook?
    const momentId = props.match.params.id;

    const [focusedElement, setFocusedElement] = useState(null);
    const [focusedElementId, setFocusedElementId] = useState(null);
    const [focusedElementType, setFocusedElementType] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [notes, setNotes] = useState([]);
    const [layout, setLayout] = useState(defaultLayout);

    // mark component as mounted so we don't set any states after unmount
    const isComponentMounted = useRef(true);
    useEffect(() => {
        return function whenUnmounted() {
            isComponentMounted.current = false;
        }
    }, []);

    // subscribe to photos
    // TODO: after new photo added, it's not shown until re-render
    useEffect(() => {
        console.debug('streaming photos...');//
        const cleanup = FirestoreService.streamPhotos(momentId, (snapshot) => {
            const items = snapshot.docs.map((documentSnapshot) => {
                const id = documentSnapshot.id;
                return {
                    id: id,
                    alt: documentSnapshot.data().alt,
                    src: LocalStorageService.getPhoto(id),
                };
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
        for (const photo of photos) {
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
    }, [momentId, photos]);

    // subscribe to notes
    useEffect(() => {
        const cleanup = FirestoreService.streamNotes(momentId, (snapshot) => {
            let items = [];

            snapshot.forEach((documentSnapshot) => {
                const item = documentSnapshot.data();
                items.push({
                    id: documentSnapshot.id,
                    title: item.title,
                    content: item.content,
                });
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

            FirestoreService.upload(momentId, ref.id, file, metadata)
                .then((imageRef) => {
                    ref.update({
                        storage: imageRef.fullPath
                    });
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
                    <Photos photos={photos} addPhoto={addPhoto} removePhoto={remove}
                            setFocused={setFocused}/>
                );
            case ('Notes'):
                return (
                    <Notes notes={notes} addNote={(note) => {
                        FirestoreService.add(momentId, 'notes', note)
                    }} setFocused={setFocused}/>
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
        switch (type) {
            case 'photos':
                return (
                    <img className="photo" src={element.src} alt={element.alt}/>
                );
            case 'notes':
                return (
                    <div className="note">
                        <h3 className="title">{element.title}</h3>
                        <p className="content" dangerouslySetInnerHTML={{__html: element.content}}/>
                    </div>
                );
            default:
                return;
        }
    }

    const content = (
        layout.map((row, index) => {
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
        })
    );

    let mainDiv = (
        <main id="main">
            {content}
        </main>
    );

    if (focusedElement) {
        mainDiv = (
            <main id="main" className="focused">
                <div id="focused-buttons" className="row">
                    <div className="button danger" id="focused-element-remove"
                         onClick={removeFocusedElement}><span><FaTrash/></span></div>
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

    return (
        <div className="App">
            <Header className="Header" momentId={momentId}/>
            {mainDiv}
            <footer>
                [footer]
            </footer>
        </div>
    );
}

export default withRouter(Moment);
