import React from 'react';
import styled from "styled-components";

export const StyledNote = styled.li`
  cursor: pointer;
  height: 40px;
  
  &:nth-child(even) {
    background-color: var(--lighter-background);
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
        <StyledNote onClick={onClick}>
            <span>{note.title}</span>
        </StyledNote>
    );
};

export default Note;
