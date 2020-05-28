/* global WEBPACK_MANIFEST */
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { StyleSheetManager } from 'styled-components';
import App from './App';
import { StyledFrame } from './components/StyledFrame';
import './index.css';
// import * as serviceWorker from './serviceWorker';

// We expect to be injected into an iframe. Need some safety checks here I suppose
const document = window.parent.document;

// Create a container in the parent
const container = document.createElement('div');
container.id = 'react-container';
document.body.appendChild(container);

const PositionedFrame = styled(StyledFrame)`
  position: fixed;
  bottom: 0;
  right: 0;
`;

const PositionedFrame2 = styled(StyledFrame)`
  position: fixed;
  bottom: 200px;
  right: 0;
`;

ReactDOM.render(
  <React.StrictMode>
    <StyleSheetManager target={container}>
      <>
        <PositionedFrame head={<link rel="stylesheet" href={WEBPACK_MANIFEST['main.css']} />}>
          <App />
        </PositionedFrame>
        <PositionedFrame2 head={<link rel="stylesheet" href={WEBPACK_MANIFEST['main.css']} />}>
          <App />
        </PositionedFrame2>
      </>
    </StyleSheetManager>
  </React.StrictMode>,
  container
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
