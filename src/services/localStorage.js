/**
 * fetches a photo from local storage
 *
 * @param id
 * @returns {*|null}
 */
export function getPhoto(id) {
    let photoCache = localStorage.getItem('photoCache');
    photoCache = photoCache ? JSON.parse(photoCache) : {};
    return photoCache[id] ?? null;
}

/**
 * saves a photo in local storage
 * @param id
 * @param src
 */
export function setPhoto({id, src}) {
    let photoCache = localStorage.getItem('photoCache');
    photoCache = photoCache ? JSON.parse(photoCache) : {};
    photoCache[id] = src;
    photoCache = JSON.stringify(photoCache);
    localStorage.setItem('photoCache', photoCache);
}
