import React from 'react';
import GlobalStyle from './GlobalStyle'; // Adjust the path accordingly

const CustomLayout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
};

export default CustomLayout;
