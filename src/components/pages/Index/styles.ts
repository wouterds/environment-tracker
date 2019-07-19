import styled, { css } from 'styled-components';
import { breakpoints } from 'styles';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0.5rem 0;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: ${breakpoints.lg}px) {
    flex-direction: column;
    flex: auto;
  }
`;

export const ChartRow = styled(Row)`
  flex: 1;
  margin: 0.25rem 0.5rem;
`;

export const LoadingRow = styled(Row)`
  flex: 1;
  margin: 0.25rem 0.5rem;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 300;
  color: #aeb9c2;
`;

export const Column = styled.div`
  display: flex;
  flex: 1;
  margin: 0.25rem 0.5rem;
`;

export const HeaderColumn = styled(Column)`
  align-items: center;
  justify-content: center;
  margin: 0.5rem 1rem;
  min-height: 30px;

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

export const FooterColumn = styled(Column)`
  padding: 0 0.5rem;
  color: #aeb9c2;
  font-size: 0.8rem;
  font-weight: 400;

  > div {
    flex: 1;
    vertical-align: middle;

    + div {
      text-align: right;
    }
  }
`;

export const Status = styled.div<{ status: string | null }>`
  display: inline-block;
  height: 8px;
  width: 8px;
  border-radius: 4px;
  background: #eee;
  margin-left: 3px;
  margin-bottom: 1px;

${({ status }) =>
  !status &&
  css`
    background: #f9ca24;
  `}

${({ status }) =>
  status === 'error' &&
  css`
    background: #eb4d4b;
  `}

${({ status }) =>
  status === 'ok' &&
  css`
    background: #6ab04c;
  `}
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
