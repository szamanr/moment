import React from "react";
import './Photos.css';

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

        const src = this.props.photoService.getRandomPhotoSrc();

        const newPhoto = {src: src, alt: 'react logo'};
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
     * opens the selected photo in full screen view
     *
     * @param id
     * @param e
     */
    fullscreenPhoto = (id, e) => {
        e.preventDefault();

        this.props.setFullscreen(e.target);
    }

    addPhotoElement = (
        <card className="photo photo-add">
            <a href="javascript:void(0)" onClick={this.addPhotoDialog}>
                <span role="img" aria-label="add-photo">➕</span>
            </a>
        </card>
    );

    render() {
        let id = 0;
        const photoElements = this.props.photos.map(photo => {
            return (
                <card key={id} className="photo" onClick={this.fullscreenPhoto.bind(this, id++)}>
                    <img src={photo.src} width={this.size.w} height={this.size.h} alt={photo.alt}/>
                </card>
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
