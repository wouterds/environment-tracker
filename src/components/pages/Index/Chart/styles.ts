import styled from 'styled-components';

export const Chart = styled.div`
  border: 1px solid rgb(236, 239, 241);
  border-radius: 5px;
  box-shadow: rgba(17, 51, 83, 0.02) 0px 4px 12px 0px;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 15px;
  overflow: hidden;
`;

export const ChartContent = styled.div`
  flex: 1;
  position: relative;
`;

export const LastValue = styled.div`
  color: #050f18;
  font-size: 2.25rem;
  position: absolute;
  top: 25px;
  left: 25px;
  background: #fff;
  border-radius: 5px;
  padding: 10px;
  display: inline-block;

  span {
    display: inline-block;
    font-size: 0.7em;
    margin-top: -20px;
    margin-left: 5px;
    vertical-align: middle;
  }
`;

export const ChartFooter = styled.ul`
  border-top: 1px solid rgb(236, 239, 241);
  padding: 15px;
  margin: 0;
  background: #fcfcfc;

  li {
    padding: 10px 15px;
    list-style: inside;
    list-style-type: none;
    display: inline-block;
    min-width: 100px;

    + li {
      margin-left: 25px;
    }

    label,
    span {
      display: block;
    }

    label {
      font-weight: 400;
      color: #6f8597;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }

    span {
      color: #050f18;
      font-size: 1rem;

      span {
        display: inline-block;
        font-size: 0.7em;
        margin-top: -10px;
        margin-left: 3px;
        vertical-align: middle;
      }
    }
  }
`;
