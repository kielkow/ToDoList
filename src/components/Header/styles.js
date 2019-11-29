import styled from 'styled-components';

import { Link } from 'react-router-dom';

export const Container = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 50px 50px;
  text-decoration: none;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  h1 {
    margin-left: 10px;
    color: #fff;
  }
`;
