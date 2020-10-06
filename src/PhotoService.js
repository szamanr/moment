class PhotoService {
    /**
     * returns a random photo from pre-defined list
     * @returns {string}
     */
    getRandomPhotoSrc() {
        const photos = ["react.svg", "6lm10a.png", "angular.png", "banana.jpg", "bedraggled.jpg", "cudgel.jpg", "dog-mask.jpg", "hal-cropped.jpg", "laravel.png", "trip01.png", "trip02.png", "trip03.png"];
        const photoId = Math.floor(Math.random() * photos.length);
        return photos[photoId];
    }
}

export default PhotoService;
