import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useParams, withRouter} from 'react-router-dom';
import Notes from "./Notes";
import Photos from "./Photos";
import './global.css';
import * as FirestoreService from "./services/firestore";
import * as LocalStorageService from "./services/localStorage";
import useLayout from "./hooks/useLayout";
import Box from "./styled-components/Box";
import {MomentContainer} from "./styled-components/MomentContainer";
import Row from "./styled-components/Row";

const Moment = ({db, setFocused}) => {
    const {momentId} = useParams();
    const history = useHistory();

    const [photos, setPhotos] = useState(new Map());
    const [notes, setNotes] = useState(new Map());
    const layout = useLayout(db, momentId);

    // set flag when uploading photo, so we can display it when upload is finished
    const [isPhotoUploading, setIsPhotoUploading] = useState(false);

    // mark component as mounted so we don't set any states after unmount
    const isComponentMounted = useRef(true);
    useEffect(() => {
        return function whenUnmounted() {
            isComponentMounted.current = false;
        }
    }, []);

    /**
     * subscribes to photos
     */
    useEffect(() => {
        console.debug('streaming photos...');//
        const cleanup = db.collection('moments').doc(momentId)
            .collection('photos')
            .orderBy('createdAt')
            .onSnapshot(snapshot => {
                const items = FirestoreService.parsePhotos(snapshot);
                setPhotos(items);
            });

        return function photosUnsubscribe() {
            cleanup();
        };
    }, [db, momentId]);


    /**
     * fetches images from storage
     * TODO: after image added, 12 requests are sent. check why so many.
     */
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

    /**
     * subscribes to notes
     */
    useEffect(() => {
        const cleanup = db.collection('moments').doc(momentId)
            .collection('notes')
            .orderBy('createdAt')
            .onSnapshot(snapshot => {
                const items = FirestoreService.parseNotes(snapshot);
                setNotes(items);
            });

        return function notesUnsubscribe() {
            cleanup();
        }
    }, [db, momentId]);

    /**
     * sets the chosen element to be focused, i.e. displayed as the only element in the main view
     *
     * @param element
     * @param type
     */
    const setFocusedElement = function (type = null, element = null) {
        setFocused(element);

        history.push(`/moment/${momentId}/${type}/${element?.id}`);
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
     * initialises a component based on its name.
     *
     * @param componentName
     * @returns {*}
     */
    const initComponent = function (componentName) {
        switch (componentName) {
            case ('Photos'):
                return (
                    <Photos photos={Array.from(photos.values())} onClick={setFocusedElement.bind(null, 'photos')}
                            addPhoto={addPhoto}/>
                );
            case ('Notes'):
                return (
                    <Notes notes={Array.from(notes.values())} addNote={(note) => {
                        FirestoreService.add(momentId, 'notes', note)
                    }} onClick={setFocusedElement.bind(null, 'notes')}/>
                );
            default:
                return componentName;
        }
    }

    return (
        <MomentContainer>
            {layout.map((row, index) => {
                return (
                    <Row span={row?.span} key={index}>
                        {row.components.map((component, index) => {
                            return (
                                <Box key={index}>
                                    {initComponent(component)}
                                </Box>
                            );
                        })}
                    </Row>
                );
            })}
        </MomentContainer>
    );
};

export default withRouter(Moment);
