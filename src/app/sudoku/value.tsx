import styled from "@emotion/styled";
import type { Value } from "./types";
import { lora } from "@/styles/fonts";

export const ValueMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const ValueContent = styled.div<{
  isOriginal: boolean;
  hasError: boolean;
}>`
  transition: all 0.5s;
  display: flex;
  color: ${({ isOriginal, hasError }) =>
    isOriginal ? "black" : hasError ? "red" : "green"};
  font-weight: bold;
`;

export const ValueWrapper: React.FC<Omit<Value, "noteValues">> = ({
  value,
  ...otherProps
}) => (
  <ValueMain>
    <ValueContent
      className={`${lora.className} items-center justify-center text-2xl`}
      {...otherProps}
    >
      {value}
    </ValueContent>
  </ValueMain>
);
