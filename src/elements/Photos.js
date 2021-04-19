import React from "react";
import './Photos.css';
import {FaPlus} from "react-icons/fa";

const Photos = ({addPhoto, onClick, photos}) => {
    const size = {w: "150px", h: "150px"};
    const defaultMetadata = {
        cacheControl: 'public, max-age=900, immutable'
    };

    const addPhotoElement = (
        <div className="photo photo-add">
            <label htmlFor="photo-add" className="button brand" title="add photo">
                <FaPlus/>
            </label>
            <input data-testid="photo-add" id="photo-add" name="photo-add" type="file" hidden multiple={true}
                   onChange={(e) => {
                       addPhoto(e.target.files, defaultMetadata);
                   }}/>
        </div>
    );

    const photoElements = photos.map((photo) => {
        return (
            <div key={photo.id} className="photo" onClick={onClick.bind(null, photo)} aria-label="photo">
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
};

export default Photos;
