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

/**
 * a content box containing a single element: photos, notes, map, player, etc.
 * @type {StyledComponent<"div", AnyIfEmpty<DefaultTheme>, {}, never>}
 */
export const Box = styled.div`
  min-height: 150px;
  max-height: 100%;
  margin: 5px;
  border: solid 1px;
  border-radius: 5px;
  overflow-y: auto;
  display: grid;
  place-items: center;
`;
