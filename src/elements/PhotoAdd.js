import React from 'react';
import {FaPlus} from "react-icons/fa";
import {AddPhotoContainer} from "../styled-components/PhotoContainer";

const PhotoAdd = ({addPhoto}) => {
    const defaultMetadata = {
        cacheControl: 'public, max-age=900, immutable'
    };

    return (
        <AddPhotoContainer>
            <label htmlFor="photo-add" className="button brand" title="add photo">
                <FaPlus/>
            </label>
            <input data-testid="photo-add" id="photo-add" name="photo-add" type="file" hidden multiple={true}
                   onChange={(e) => {
                       addPhoto(e.target.files, defaultMetadata);
                   }}/>
        </AddPhotoContainer>
    );
};

export default PhotoAdd;
