import styled from 'styled-components';

export const Container = styled.div`
  background: #13222c;
  padding: 0.5rem;
  border-radius: 0.25rem;
  text-align: center;
  line-height: 1.6;

  p {
    margin: 0;
  }
`;

export const Label = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
`;

export const Value = styled.p`
  color: #fff;
  font-weight: 400;

  span {
    display: inline-block;
    font-size: 0.7em;
    margin-top: -1em;
    margin-left: 0.2em;
    vertical-align: middle;
  }
`;
