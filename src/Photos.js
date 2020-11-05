import React from "react";
import './Photos.css';
import {FaPlus} from "react-icons/fa";

class Photos extends React.Component {
    size = {w: "150px", h: "150px"};
    defaultMetadata = {
        cacheControl: 'public;max-age=300'
    };

    constructor(props) {
        super(props);

        this.removePhoto = this.removePhoto.bind(this);
    }

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
            <label htmlFor="photo-add" className="button brand">
                <FaPlus/>
            </label>
            <input id="photo-add" name="photo-add" type="file" hidden multiple={true}
                   onChange={(e) => {
                       this.props.addPhoto(e.target.files, this.defaultMetadata);
                   }}/>
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
