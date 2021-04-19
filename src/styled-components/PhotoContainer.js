import styled from "styled-components";

export const PhotoContainer = styled.div`
  flex: 0 1 150px;
  margin: 5px;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

export const AddPhotoContainer = styled(PhotoContainer)`
  font-size: xx-large;
  width: 150px;
  height: 150px;
`;
