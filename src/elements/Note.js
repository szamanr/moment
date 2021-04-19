import React from 'react';
import styled from "styled-components";

const Container = styled.li`
  cursor: pointer;
  height: 40px;
  
  &:nth-child(even) {
    background-color: #2b2b2b;
  }
  
  > span {
    padding: 0 5px;
    height: 100%;
    display: grid;
    align-items: center;
  }
`;

const Note = ({note, onClick}) => {
    return (
        <Container onClick={onClick}>
            <span>{note.title}</span>
        </Container>
    );
};

export default Note;
