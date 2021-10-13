/**
 * Copyright (c) 2021 MeetOnline.IO
 *
 * long description for the file
 *
 * @summary INDEX.js INIT FILE
 * @author Rishabh <rishabh.it.007@gmail.com>
 *
 * Created at     : 2021-02-26 12:00:00 
 * Last modified  : 2021-02-26 12:00:00 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app';
import reportWebVitals from './util/reportWebVitals';
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from 'recoil';
import { extendTheme } from "@chakra-ui/react"
import { SDKContextProvider } from "./context/SDKContext";

console.log("process.env.PUBLIC_URL => " + process.env.PUBLIC_URL);
console.log("process.env.REACT_APP_SDK_URL => " + process.env.REACT_APP_SDK_URL + '/mo.sdk.js?r=h2s9o4');
console.log("process.env.NODE_ENV => " + process.env.NODE_ENV);
console.log("process.env.REACT_APP_STAGE => " + process.env.REACT_APP_STAGE);

const theme = extendTheme({
  textStyles: {

  },
})

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <SDKContextProvider>
          <App />
        </SDKContextProvider>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
