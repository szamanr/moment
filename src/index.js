import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from "firebase";
import {BrowserRouter} from "react-router-dom";

firebase.initializeApp({
    apiKey: "AIzaSyD5IMuc6iK6KTGFQwbZAc7c7QkFGzZV1MQ",
    authDomain: "moment-a16db.firebaseapp.com",
    databaseURL: "https://moment-a16db.firebaseio.com",
    projectId: "moment-a16db",
    storageBucket: "moment-a16db.appspot.com",
    messagingSenderId: "897838693187",
    appId: "1:897838693187:web:09b69181f3a9dd67ff4df6"
});

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
