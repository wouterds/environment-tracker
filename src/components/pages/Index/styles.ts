import styled from 'styled-components';
import { breakpoints } from 'styles';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;

  @media (max-width: ${breakpoints.lg}px) {
    flex-direction: column;
    flex: auto;
  }
`;
