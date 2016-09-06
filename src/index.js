import firebase from 'firebase/app';
import React from 'react';
import {AppRegistry} from 'react-native';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Provider from './components/Provider';
import App from './components/App';
import Timebox from './components/Timebox';
import './index.css';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCohfn5YXGIfehlrZTFE5moY2AowbrhMaw",
  authDomain: "tc39-timebox.firebaseapp.com",
  databaseURL: "https://tc39-timebox.firebaseio.com",
  storageBucket: "tc39-timebox.appspot.com",
});

const TimeboxApp = () => (
  <Provider app={app}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Timebox}/>
      </Route>
    </Router>
  </Provider>
);

AppRegistry.registerComponent('Timebox', () => TimeboxApp);
AppRegistry.runApplication('Timebox', {
  rootTag: document.getElementById('root')
});
