import React from "react";
import styled from "styled-components";
import Photo from "./Photo";
import PhotoAdd from "./PhotoAdd";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Photos = ({addPhoto, onClick, photos}) => {
    return (
        <Container>
            {photos.map(photo =>
                <Photo photo={photo} key={photo.id} onClick={onClick.bind(null, photo)}/>
            )}
            <PhotoAdd addPhoto={addPhoto}/>
        </Container>
    );
};

export default Photos;
