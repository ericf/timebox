import firebase from 'firebase/app';
import React from 'react';
import {AppRegistry} from 'react-native';
import {BrowserRouter} from 'react-router';
import Provider from './containers/Provider';
import App from './containers/App';
import './index.css';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCohfn5YXGIfehlrZTFE5moY2AowbrhMaw",
  authDomain: "tc39-timebox.firebaseapp.com",
  databaseURL: "https://tc39-timebox.firebaseio.com",
  storageBucket: "tc39-timebox.appspot.com",
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
