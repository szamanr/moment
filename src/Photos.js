import React from "react";
import './Photos.css';
import ImageUploader from "react-images-upload";

class Photos extends React.Component {
    size = {w: "150px", h: "150px"};

    constructor(props) {
        super(props);

        this.addPhotoDialog = this.addPhotoDialog.bind(this);
        this.removePhoto = this.removePhoto.bind(this);
    }

    /**
     * opens dialog for adding new photo
     * TODO: for now just adds a dummy photo immediately
     * @param e
     */
    addPhotoDialog = (e) => {
        e.preventDefault();

        const photoCount = this.props.photos.length;

        const src = this.props.photoService.getRandomPhotoSrc();

        const newPhoto = {src: src, alt: `image ${photoCount}`};
        this.props.addPhoto(newPhoto);
    };

    /**
     * removes an item from the list
     * @param id
     * @param e
     */
    removePhoto = (id, e) => {
        e.preventDefault();

        this.props.removePhoto(id);
    }

    /**
     * opens the selected photo in focused view
     *
     * @param id
     * @param e
     */
    focusedPhoto = (id, e) => {
        e.preventDefault();

        this.props.setFocused(e.target, id, 'photos');
    }

    // TODO: image uploader styling
    addPhotoElement = (
        <div className="photo photo-add">
            <ImageUploader
                withIcon={true}
                withLabel={false}
                singleImage={true}
                buttonText="+"
                onChange={this.props.addPhoto}
                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                maxFileSize={5242880}
            />
        </div>
    );

    render() {
        const photoElements = this.props.photos.map((photo) => {
            return (
                <div key={photo.id} className="photo" onClick={this.focusedPhoto.bind(this, photo.id)}>
                    <img src={photo.src} width={this.size.w} height={this.size.h} alt={photo.alt}/>
                </div>
            );
        });

        return (
            <div className="photos">
                {photoElements}
                {this.addPhotoElement}
            </div>
        );
    }
}

export default Photos;
