import styled from "styled-components";

export const AppContainer = styled.div`
  display: grid;
  height: 100vh;
  grid-template: repeat(24, 1fr) / auto 1fr auto;

  color: var(--base-color);
  background-color: var(--base-background);

  header {
    grid-row: 1 / 4;
  }

  main {
    grid-row: 4 / 24;
  }

  footer {
    grid-row: 24;
  }

  header, main, footer {
    grid-column: 1 / 3;
  }
`;
