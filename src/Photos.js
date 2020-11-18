import React from "react";
import './Photos.css';
import {FaPlus} from "react-icons/fa";

function Photos(props) {
    const size = {w: "150px", h: "150px"};
    const defaultMetadata = {
        cacheControl: 'public, max-age=900, immutable'
    };

    /**
     * removes an item from the list
     * @param id
     * @param e
     */
    const removePhoto = (id, e) => {
        e.preventDefault();

        props.removePhoto(id);
    }

    /**
     * opens the selected photo in focused view
     *
     * @param id
     * @param e
     */
    const focusedPhoto = (id, e) => {
        e.preventDefault();

        props.setFocused(e.target, id, 'photos');
    }

    const addPhotoElement = (
        <div className="photo photo-add">
            <label htmlFor="photo-add" className="button brand">
                <FaPlus/>
            </label>
            <input id="photo-add" name="photo-add" type="file" hidden multiple={true}
                   onChange={(e) => {
                       props.addPhoto(e.target.files, defaultMetadata);
                   }}/>
        </div>
    );

    const photoElements = props.photos.map((photo) => {
        return (
            <div key={photo.id} className="photo" onClick={focusedPhoto.bind(this, photo.id)}>
                <img src={photo.src} width={size.w} height={size.h} alt={photo.alt}/>
            </div>
        );
    });

    return (
        <div className="photos">
            {photoElements}
            {addPhotoElement}
        </div>
    );
}

export default Photos;
