import styled from "styled-components";

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

export default Box;
