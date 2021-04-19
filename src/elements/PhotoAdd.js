import React from 'react';
import {FaPlus} from "react-icons/fa";
import styled from "styled-components";
import {StyledPhoto} from "./Photo";

export const StyledAddPhoto = styled(StyledPhoto)`
  font-size: xx-large;
  width: 150px;
  height: 150px;
`;

const PhotoAdd = ({addPhoto}) => {
    const defaultMetadata = {
        cacheControl: 'public, max-age=900, immutable'
    };

    return (
        <StyledAddPhoto>
            <label htmlFor="photo-add" className="button brand" title="add photo">
                <FaPlus/>
            </label>
            <input data-testid="photo-add" id="photo-add" name="photo-add" type="file" hidden multiple={true}
                   onChange={(e) => {
                       addPhoto(e.target.files, defaultMetadata);
                   }}/>
        </StyledAddPhoto>
    );
};

export default PhotoAdd;
