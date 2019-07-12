import styled from 'styled-components';

export const Container = styled.div`
  background: #13222c;
  padding: 10px;
  border-radius: 3px;
  text-align: center;
  line-height: 1.6;

  p {
    margin: 0;
  }
`;

export const Label = styled.p`
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.75rem;
`;

export const Value = styled.p`
  color: #fff;

  span {
    display: inline-block;
    font-size: 0.7rem;
    margin-top: -10px;
    margin-left: 3px;
    vertical-align: middle;
  }
`;
