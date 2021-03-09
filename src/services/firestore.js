import firebase from "firebase";
import * as LocalStorageService from "./localStorage";
import firebaseConfig from "../firebase.config";

// initialise app or use existing one
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const db = firebase.firestore();
const storage = firebase.storage();

/**
 * authenticates a user using given email and password
 * TODO: remove default dummy user data
 *
 * @param email
 * @param password
 * @returns {Promise<firebase.auth.UserCredential>}
 */
export const authenticate = (email = 'user1@mailinator.com', password = 'MomentMoment123#') => {
    return firebase.auth()
        .signInWithEmailAndPassword(email, password);
};

export const authenticateAnonymously = () => {
    return firebase.auth().signInAnonymously();
};

export const getMoment = (id) => {
    return db.collection('moments')
        .doc(id)
        .get();
};

/**
 * parses moments from a firebase snapshot into an array
 *
 * @param snapshot
 * @returns {[]}
 */
export const parseMoments = (snapshot) => {
    const items = [];

    snapshot.forEach((documentSnapshot) => {
        const item = documentSnapshot.data();
        const title = item.title ?? 'moment ' + documentSnapshot.id
        items.push({
            id: documentSnapshot.id,
            title
        });
    });

    return items;
};

/**
 * parses photos from a firebase snapshot into a map
 *
 * @param snapshot
 * @returns {Map<any, any>}
 */
export const parsePhotos = snapshot => {
    const items = new Map();
    snapshot?.docs.forEach((documentSnapshot) => {
        const id = documentSnapshot.id;
        const item = {
            id: id,
            alt: documentSnapshot.data().alt,
            src: LocalStorageService.getPhoto(id),
        };

        items.set(id, item);
    });

    return items;
};

/**
 * parses notes from a firebase snapshot into a map
 *
 * @param snapshot
 * @returns {Map<any, any>}
 */
export const parseNotes = (snapshot) => {
    const items = new Map();

    snapshot.forEach((documentSnapshot) => {
        const item = documentSnapshot.data();

        items.set(documentSnapshot.id, {
            id: documentSnapshot.id,
            title: item.title,
            content: item.content,
        })
    });

    return items;
};

/**
 * fetch a storage item with a given id from a Moment's storage bucket
 *
 * @param momentId
 * @param itemId
 * @returns {Promise<any>}
 */
export const getStorageItem = (momentId, itemId) => {
    return storage.ref(momentId).child(itemId).getDownloadURL();
};

/**
 * adds an item to a collection
 *
 * @param momentId
 * @param collection
 * @param item
 * @returns {*}
 */
export const add = (momentId, collection, item) => {
    const ref = db.collection('moments').doc(momentId)
        .collection(collection).doc();

    ref.set(Object.assign(item, {
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }));

    return ref;
};

/**
 * updates an element in a collection
 *
 * @param momentId
 * @param collection
 * @param item
 * @returns {*}
 */
export const update = (momentId, collection, item) => {
    const ref = db.collection('moments').doc(momentId)
        .collection(collection).doc(item.id);

    ref.update(Object.assign(item, {
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }));

    return ref;
}

/**
 * uploads a file to storage
 *
 * @param momentId
 * @param name
 * @param file
 * @param metadata
 * @returns {Promise<any>}
 */
export const upload = (momentId, name, file, metadata) => {
    const imageRef = storage.ref(momentId).child(name);
    return imageRef.put(file, metadata).then(() => {
        console.log(`file ${file.name} uploaded!`);
        return imageRef;
    });
}

/**
 * removes an item from collection
 *
 * @param momentId
 * @param collection
 * @param id
 * @returns {Promise<void>}
 */
export const remove = (momentId, collection, id) => {
    return db.collection('moments').doc(momentId)
        .collection(collection).doc(id)
        .delete();
};

/**
 * removes a file from storage
 *
 * @param momentId
 * @param id
 * @returns {Promise<any>}
 */
export const removeFromStorage = (momentId, id) => {
    return storage.ref(momentId)
        .child(id)
        .delete();
};
