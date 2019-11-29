import React from 'react';

import { MdHome } from 'react-icons/md';

import { Container } from './styles';

export default function Header() {
  return (
    <Container to="/">
      <MdHome size={36} color="#FFF" />
      <h1>ToDoList</h1>
    </Container>
  );
}
