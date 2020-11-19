import React, {useEffect, useState} from 'react';
import './Moment.css';
import Header from "./Header";
import Notes from "./Notes";
import Photos from "./Photos";
import './global.css';
import {FaTimes, FaTrash} from 'react-icons/fa';
import {withRouter} from "react-router-dom";
import * as FirestoreService from "./services/firestore";

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

    const momentId = props.match.params.id;

    const [focusedElement, setFocusedElement] = useState(null);
    const [focusedElementId, setFocusedElementId] = useState(null);
    const [focusedElementType, setFocusedElementType] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [notes, setNotes] = useState([]);
    const [layout, setLayout] = useState(defaultLayout);
    const [cachedPhotoUrls, setCachedPhotoUrls] = useState({});

    // subscribe to photos
    useEffect(() => {
        const photosUnsubscribe = FirestoreService.streamPhotos(momentId, (snapshot) => {
            let items = [];
            snapshot.forEach((documentSnapshot) => {
                const item = documentSnapshot.data();
                const id = documentSnapshot.id;

                const photosCount = items.push({
                    id,
                    alt: item.alt,
                    src: null,
                });

                // load photo from cache
                if (cachedPhotoUrls[id]) {
                    items[photosCount - 1].src = cachedPhotoUrls[id];

                    setPhotos(items);
                } else {
                    // if no cache, fetch photo
                    FirestoreService.getStorageItem(momentId, id).then((url) => {
                        items[photosCount - 1].src = url;

                        setPhotos(items);

                        // cache it
                        setCachedPhotoUrls(Object.assign({}, cachedPhotoUrls, {[id]: url}));
                    }, (error) => {
                        if (item.storage) {
                            console.error(error);
                        } else {
                            // file is still being uploaded, download will try again
                        }
                    });
                }
            });

            setPhotos(items);
        });

        return function cleanup() {
            photosUnsubscribe();
        };
    }, [momentId]);

    // subscribe to notes
    useEffect(() => {
        const notesUnsubscribe = FirestoreService.streamNotes(momentId, (snapshot) => {
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

        return function cleanup() {
            notesUnsubscribe();
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
                            setFocused={setFocused} photoService={props.photoService}/>
                );
            case ('Notes'):
                return (
                    <Notes notes={notes} addNote={(note) => {
                        FirestoreService.add(momentId, 'notes', note)
                    }} setFocused={setFocused}
                           noteService={props.noteService}/>
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
