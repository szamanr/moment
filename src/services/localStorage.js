/**
 * fetches a photo from local storage
 *
 * @param id
 * @returns {*|null}
 */
export const getPhoto = id => {
    let photoCache = localStorage.getItem('photoCache');
    photoCache = photoCache ? JSON.parse(photoCache) : {};
    return photoCache[id] ?? null;
};

/**
 * saves a photo in local storage
 * @param id
 * @param src
 */
export const setPhoto = ({id, src}) => {
    let photoCache = localStorage.getItem('photoCache');
    photoCache = photoCache ? JSON.parse(photoCache) : {};
    photoCache[id] = src;
    photoCache = JSON.stringify(photoCache);
    localStorage.setItem('photoCache', photoCache);
};
