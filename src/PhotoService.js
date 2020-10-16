class PhotoService {
    /**
     * returns a random photo from pre-defined list
     *
     * @returns {string}
     */
    getRandomPhotoSrc() {
        const photos = ["react.png", "6lm10a.png", "angular.png", "banana.jpg", "bedraggled.jpg", "cudgel.jpg", "dog-mask.jpg", "hal-cropped.jpg", "laravel.png", "trip01.png", "trip02.png", "trip03.png"];
        const photoId = Math.floor(Math.random() * photos.length);
        return photos[photoId];
    }

    /**
     * generates a specified number of dummy photos
     *
     * @param count
     * @returns {[]}
     */
    generate(count) {
        const photos = [];

        for (let i = 0; i < count; i++) {
            photos.push(
                {src: this.getRandomPhotoSrc(), alt: `default image ${i + 1}`}
            )
        }
        return photos;
    }
}

export default PhotoService;
