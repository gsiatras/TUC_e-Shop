import React from 'react';
import GlobalStyle from './GlobalStyle'; // Adjust the path accordingly
import { CartContextProvider } from './CartContext';

const CustomLayout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <CartContextProvider>
        {children}
      </CartContextProvider>
    </>
  );
};

export default CustomLayout;
