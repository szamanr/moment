import React from 'react';
import styled from "styled-components";

const size = {w: "150px", h: "150px"};

export const StyledPhoto = styled.div`
  flex: 0 1 150px;
  margin: 5px;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const Photo = ({photo, onClick}) => {
    return (
        <StyledPhoto aria-label="photo" onClick={onClick}>
            <img src={photo.src} width={size.w} height={size.h} alt={photo.alt}/>
        </StyledPhoto>
    );
};

export default Photo;
