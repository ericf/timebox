import firebase from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom';
import Provider from './components/Provider';
import App from './components/App';
import './index.css';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCohfn5YXGIfehlrZTFE5moY2AowbrhMaw",
  authDomain: "tc39-timebox.firebaseapp.com",
  databaseURL: "https://tc39-timebox.firebaseio.com",
  storageBucket: "tc39-timebox.appspot.com",
});

ReactDOM.render(
  <Provider app={app}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
