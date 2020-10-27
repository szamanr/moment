import React from "react";
import './Photos.css';
import {FaPlus} from 'react-icons/fa'

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

    addPhotoElement = (
        <div className="photo photo-add">
            <span className="button brand" onClick={this.addPhotoDialog}>
                <FaPlus/>
            </span>
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
