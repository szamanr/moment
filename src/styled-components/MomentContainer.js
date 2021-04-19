import styled from "styled-components";

export const MomentContainer = styled.main`
  display: grid;
  height: 100%;
  grid-template: repeat(auto-fit, calc(100% / 3)) / auto 1fr auto;
  overflow: auto;
  background-color: var(--base-background);
`;

export const FocusedMomentContainer = styled(MomentContainer)`
  grid-template-rows: repeat(12, 1fr);
  border: solid 1px;
  border-radius: 5px;
`;
