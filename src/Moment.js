import React from 'react';
import './Moment.css';
import Header from "./Header";
import Notes from "./Notes";
import Photos from "./Photos";
import './global.css';
import {FaTimes, FaTrash} from 'react-icons/fa';
import firebase from "firebase";
import {withRouter} from "react-router-dom";

class Moment extends React.Component {
    defaultLayout = [
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

    momentId;
    db;
    storage;
    subscriptions = [];

    constructor(props, context) {
        super(props, context);

        this.momentId = this.props.match.params.id;
        this.db = firebase.firestore().collection('moments').doc(this.momentId);
        this.storage = firebase.storage().ref(this.momentId);

        this.state = {
            focusedElement: null,
            photos: [],
            notes: [],
            layout: this.defaultLayout,
            cachedPhotoUrls: {}
        };

        this.setFocused = this.setFocused.bind(this);
        this.add = this.add.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
        this.removeFocusedElement = this.removeFocusedElement.bind(this);
    }

    componentDidMount() {
        const photosUnsubscribe = this.db.collection('photos').orderBy('createdAt')
            .onSnapshot((snapshot) => {
                let photos = [];
                snapshot.forEach((documentSnapshot) => {
                    const item = documentSnapshot.data();
                    const id = documentSnapshot.id;

                    const photosCount = photos.push({
                        id,
                        alt: item.alt,
                        src: null,
                    });

                    // load photo from cache
                    if (this.state.cachedPhotoUrls[id]) {
                        photos[photosCount - 1].src = this.state.cachedPhotoUrls[id];

                        this.setState({
                            photos: photos,
                        });
                    } else {
                        // if no cache, fetch photo
                        this.storage.child(id).getDownloadURL().then((url) => {
                            photos[photosCount - 1].src = url;

                            this.setState({
                                photos: photos,
                            });

                            // cache it
                            this.setState({
                                cachedPhotoUrls: Object.assign({}, this.state.cachedPhotoUrls, {[id]: url})
                            });
                        }, (error) => {
                            if (item.storage) {
                                console.error(error);
                            } else {
                                // file is still being uploaded, download will try again
                            }
                        });
                    }
                });

                this.setState({
                    photos: photos,
                });
            });
        this.subscriptions.push(photosUnsubscribe);

        const notesUnsubscribe = this.db.collection('notes').onSnapshot((snapshot) => {
            let notes = [];

            snapshot.forEach((documentSnapshot) => {
                const item = documentSnapshot.data();
                notes.push({
                    id: documentSnapshot.id,
                    title: item.title,
                    content: item.content,
                });
            });

            this.setState({
                notes: notes,
            });
        });
        this.subscriptions.push(notesUnsubscribe);

        // TODO: remove. this is just to test if the layout can be modified dynamically.
        /*setTimeout(() => {
            this.setState({
                layout: [
                    [
                        '[map]', '[notes]', '[player]'
                    ],
                    [
                        '[Photos]'
                    ]
                ]
            });

            console.log('layout updated!');
        }, 3000)*/
    }

    componentWillUnmount() {
        for (const unsubscribe of this.subscriptions) {
            unsubscribe();
        }
    }

    /**
     * sets the chosen element to be focused, i.e. displayed as the only element in the main view
     *
     * @param element
     * @param id
     * @param type
     */
    setFocused(element = null, id = null, type = null) {
        this.setState({
            focusedElement: element,
            focusedElementId: id,
            focusedElementType: type,
        });
    }

    /**
     * inserts a given item into a given collection
     *
     * @param collection
     * @param item
     */
    add(collection, item) {
        const ref = this.db.collection(collection).doc();
        ref.set(Object.assign(item, {
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }));

        return ref;
    }

    /**
     * uploads a photo to the storage and adds it to db
     *
     * @param files
     * @param metadata
     */
    addPhoto(files, metadata = null) {
        for (const file of files) {
            const ref = this.add('photos', {src: file.name, alt: file.name});

            const imageRef = this.storage.child(ref.id);
            imageRef.put(file, metadata).then(() => {
                console.log(`file ${file.name} uploaded!`);

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
    remove(collection, id) {
        const reference = this.db.child(collection + '/' + id);

        if (collection === 'photos') {
            reference.once('value').then((snapshot) => {
                const item = snapshot.val();
                this.storage.child(id).delete().then(() => {
                    console.log(`photo ${item.src} deleted from storage.`);
                }, (error) => {
                    console.error(error.message);
                });
            });
        }

        reference.remove().then(() => {
            console.log('item removed from db.');
        });
    }

    /**
     * removes the focused photo from the list
     */
    removeFocusedElement() {
        const id = this.state.focusedElementId;
        const collection = this.state.focusedElementType;

        if (id === null || collection === null) {
            return;
        }

        this.remove(collection, id);
        this.setFocused();
    }

    /**
     * initialises a component based on its name.
     *
     * @param componentName
     * @returns {*}
     */
    initComponent(componentName) {
        switch (componentName) {
            case ('Photos'):
                return (
                    <Photos photos={this.state.photos} addPhoto={this.addPhoto} removePhoto={this.remove}
                            setFocused={this.setFocused} photoService={this.props.photoService}/>
                );
            case ('Notes'):
                return (
                    <Notes notes={this.state.notes} addNote={(note) => {
                        this.add('notes', note)
                    }} setFocused={this.setFocused}
                           noteService={this.props.noteService}/>
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
    renderFocusedElement(element, type) {
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

    render() {
        const content = (
            this.state.layout.map((row, index) => {
                return (
                    <div className={row.className} key={index}>
                        {row.components.map((component, index) => {
                            return (
                                <div className="box" key={index}>
                                    {this.initComponent(component)}
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

        if (this.state.focusedElement) {
            mainDiv = (
                <main id="main" className="focused">
                    <div id="focused-buttons" className="row">
                        <div className="button danger" id="focused-element-remove"
                             onClick={this.removeFocusedElement}><span><FaTrash/></span></div>
                        <div className="button" id="focused-element-close"
                             onClick={() => {
                                 this.setFocused()
                             }}><span><FaTimes/></span></div>
                    </div>
                    <div id="focused-element" className={"row focused-" + this.state.focusedElementType}>
                        {this.renderFocusedElement(this.state.focusedElement, this.state.focusedElementType)}
                    </div>
                </main>
            );
        }

        return (
            <div className="App">
                <Header className="Header" momentId={this.momentId}/>
                {mainDiv}
                <footer>
                    [footer]
                </footer>
            </div>
        );
    }
}

export default withRouter(Moment);
