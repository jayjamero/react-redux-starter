/* eslint no-console: ["error", { allow: ["log"] }] */
import 'babel-polyfill'; // okay so i still got a bit of love for IE9...
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, initialState, compose } from 'redux';
import ReduxPromise from 'redux-promise'; // middleware
import ReduxThunk from 'redux-thunk'; // used to fire other actions sequentially

import App from './components/App';
import reducers from './reducers';

import { ENABLE_DEV_TOOLS } from './constants/Globals';

const middleware = [ReduxThunk, ReduxPromise];

let devToolsExtension = f => f; // Initialise as an empty function

if (ENABLE_DEV_TOOLS === true) {
  console.log('_____ PROJECT HAS REDUX TOOLS ENABLED _____');
  devToolsExtension = window.devToolsExtension ? window.devToolsExtension() : f => f;
}

const store = createStore(reducers, initialState, compose(
  applyMiddleware(...middleware),
  devToolsExtension,
));

// Render react when document is ready.
ReactDOM.render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.querySelector('.app'),
);
