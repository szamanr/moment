import React from "react";
import styled from "styled-components";
import Photo from "./Photo";
import PhotoAdd from "./PhotoAdd";

const StyledPhotos = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Photos = ({addPhoto, onClick, photos}) => {
    return (
        <StyledPhotos>
            {photos.map(photo =>
                <Photo photo={photo} key={photo.id} onClick={onClick.bind(null, photo)}/>
            )}
            <PhotoAdd addPhoto={addPhoto}/>
        </StyledPhotos>
    );
};

export default Photos;
