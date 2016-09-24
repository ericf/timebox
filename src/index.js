import firebase from 'firebase/app';
import React from 'react';
import {AppRegistry} from 'react-native';
import {BrowserRouter} from 'react-router';
import Provider from './containers/Provider';
import App from './containers/App';
import './index.css';

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
});

const TimeboxApp = () => (
  <Provider app={app}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

AppRegistry.registerComponent('Timebox', () => TimeboxApp);
AppRegistry.runApplication('Timebox', {
  rootTag: document.getElementById('root')
});
