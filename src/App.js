import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import GlobalStyle from './styles/global';

import Header from './components/Header';
import Routes from './routes';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes />
      <GlobalStyle />
      <ToastContainer autoClose={3000} />
    </BrowserRouter>
  );
}
export default App;
