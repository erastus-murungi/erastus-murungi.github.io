import styled from "@emotion/styled";
import { publicSans } from "@/styles/fonts";
import type { Value } from "./types";

// Styled component for the main container
export const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

// Styled component for the content with dynamic styling
export const StyledValue = styled.div<{
  isOriginal: boolean;
  hasError: boolean;
}>`
  transition: all 0.5s;
  display: flex;
  color: ${({ isOriginal, hasError }) =>
    isOriginal ? "black" : hasError ? "red" : "green"};
  font-weight: bold;
`;

// Component to render the value with styling
export const ValueDisplay: React.FC<Omit<Value, "noteValues">> = ({
  value,
  ...otherProps
}) => (
  <CenteredContainer>
    <StyledValue
      className={`${publicSans.className} items-center justify-center text-2xl`}
      {...otherProps}
    >
      {value}
    </StyledValue>
  </CenteredContainer>
);
