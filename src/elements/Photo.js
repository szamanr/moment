import React from 'react';
import {PhotoContainer} from "../styled-components/PhotoContainer";

const size = {w: "150px", h: "150px"};

const Photo = ({photo, onClick}) => {
    return (
        <PhotoContainer aria-label="photo" onClick={onClick}>
            <img src={photo.src} width={size.w} height={size.h} alt={photo.alt}/>
        </PhotoContainer>
    );
};

export default Photo;
