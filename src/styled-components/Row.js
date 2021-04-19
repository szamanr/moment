import styled from "styled-components";

/**
 * a single row spanning the container width. can span multiple rows. 3 rows = 1 page.
 *
 * @type {StyledComponent<"div", AnyIfEmpty<DefaultTheme>, {}, never>}
 */
export const Row = styled.div`
  grid-column: 1 / span 3;
  justify-content: center;
  grid-row: span ${props => props.span ?? 1};

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export default Row;

export const FocusedRow = styled(Row)`
  display: grid;
  grid-row: 2 / span 11;

  place-items: ${props => props.type === 'photos' ? 'center' : null};

  .photo {
    max-height: 100%;
    max-width: 100%;
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  .note {
    padding: 0 5px;

    .content textarea {
      width: 100%;
    }

    label {
      font-size: small;
      color: rgba(var(--base-color), 1.5);
    }

    .title {
      text-align: center;
      font-size: 2rem;
    }
  }

  input {
    text-align: center;
    font-size: 2rem;
    border: none;
  }

  textarea {
    border: none;
  }
`;
