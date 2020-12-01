import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyD5IMuc6iK6KTGFQwbZAc7c7QkFGzZV1MQ",
    authDomain: "moment-a16db.firebaseapp.com",
    databaseURL: "https://moment-a16db.firebaseio.com",
    projectId: "moment-a16db",
    storageBucket: "moment-a16db.appspot.com",
    messagingSenderId: "897838693187",
    appId: "1:897838693187:web:09b69181f3a9dd67ff4df6"
};

firebase.initializeApp(firebaseConfig);

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

/**
 * subscribes to the moments collection for a given user
 *
 * @param user
 * @param observer
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export const streamMoments = (user, observer) => {
    return db.collection('moments')
        .where('users', 'array-contains', user.uid)
        .onSnapshot(observer);
};

/**
 * subscribe to the photos collection for a given Moment
 *
 * @param momentId
 * @param observer
 * @return An unsubscribe function that can be called to cancel the snapshot listener.
 */
export const streamPhotos = (momentId, observer) => {
    return db.collection('moments').doc(momentId)
        .collection('photos')
        .orderBy('createdAt')
        .onSnapshot(observer);
};

/**
 * subscribe to the notes collection for a given Moment
 *
 * @param momentId
 * @param observer
 * @return An unsubscribe function that can be called to cancel the snapshot listener.
 */
export const streamNotes = (momentId, observer) => {
    return db.collection('moments').doc(momentId)
        .collection('notes')
        .orderBy('createdAt')
        .onSnapshot(observer);
}

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
