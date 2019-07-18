import styled, { css } from 'styled-components';
import { breakpoints } from 'styles';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: ${breakpoints.lg}px) {
    flex-direction: column;
    flex: auto;
  }
`;

export const HeaderRow = styled(Row)`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;

  h1 {
    flex: 1;
    margin: 0;
    padding: 0;
    line-height: 1;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 1rem;
    letter-spacing: 0.1rem;
    word-spacing: 0.1rem;
    color: #050f18;
  }

  @media (max-width: ${breakpoints.lg}px) {
    min-height: 75px;
  }
`;

export const Resolution = styled.ul`
  list-style: inside;
  list-style-type: none;

  @media (max-width: ${breakpoints.lg}px) {
    margin-top: 15px;
  }
`;

export const ResolutionItem = styled.li<{ active: boolean }>`
  cursor: pointer;
  display: inline-block;
  padding: 0.4rem;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  color: #bac4ce;

  ${({ active }) =>
    active &&
    css`
      color: #6f8597;
    `}

  &:hover {
    color: #6f8597;
  }

  + li {
    margin-left: 0.5rem;
  }
`;

export const ChartRow = styled(Row)`
  flex: 1;
`;
