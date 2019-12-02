import styled from 'styled-components';

const Container = styled.div`
  max-width: 700px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #e54d3f;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    -webkit-transform: scale(1.025);
    -ms-transform: scale(1.025);
    transform: scale(1.025);
  }

  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    svg {
      margin-right: 10px;
    }
  }
`;

export default Container;
