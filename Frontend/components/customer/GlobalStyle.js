import { createGlobalStyle } from 'styled-components';
import '@fontsource/poppins';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';

const GlobalStyle = createGlobalStyle`
body {
  background: #eee;
	padding:0;
  margin:0;
  font-family: 'Poppins', sans-serif;
}

h1 {
  display: block;
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
  }
`;

export default GlobalStyle;
