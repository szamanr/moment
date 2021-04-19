import React from "react";
import styled, {keyframes} from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`;

export const SpinnerContainer = styled.main`
  display: grid;
  place-items: center;
  height: ${props => props.height};
  background-color: var(--base-background);
`;

const StyledSpinner = styled.div`
  display: grid;
  place-items: center;

  .lds-dual-ring {
    display: inline-block;
    width: 80px;
    height: 80px;
  }

  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid;
    border-color: var(--brand) transparent var(--brand) transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`;

export const Spinner = ({size}) => {
    const containerHeight = size === 'full' ? '100vh' : size === 'fit' ? '100%' : null;
    return (size === 'full' || size === 'fit') ? (
        <SpinnerContainer height={containerHeight}>
            <StyledSpinner id="spinner">
                <div className="lds-dual-ring"/>
            </StyledSpinner>
        </SpinnerContainer>
    ) : (
        <StyledSpinner id="spinner">
            <div className="lds-dual-ring"/>
        </StyledSpinner>
    );
};

export default Spinner;
