import React from 'react';
import GlobalStyle from './GlobalStyle'; // Adjust the path accordingly
import { CartContextProvider } from './CartContext';
import Header from './Header';
import Information from './Information';

const CustomLayout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <CartContextProvider>
        <Header/>
        {children}
        <Information/>
      </CartContextProvider>
    </>
  );
};

export default CustomLayout;
