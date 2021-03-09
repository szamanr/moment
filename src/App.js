import React, {useEffect, useState} from "react";
import {Route} from "react-router-dom";
import Moment from "./Moment";
import Dashboard from "./Dashboard";
import Header from "./Header";
import "./App.css";
import firebase from "firebase/app";
import firebaseConfig from "./firebase.config";

function App() {
    const [firebaseApp, setFirebase] = useState(null);

    useEffect(() => {
        // initialise app or use existing one
        if (!firebase.apps.length) {
            setFirebase(firebase.initializeApp(firebaseConfig));
        } else {
            setFirebase(firebase.app());
        }

        firebase.auth().signInWithEmailAndPassword('user1@mailinator.com', 'MomentMoment123#');
    }, []);

    return (
        <div className="App">
            <Route exact path={["/", "/dashboard"]}>
                <Dashboard/>
            </Route>

            <Route path="/moment/:momentId">
                <Header className="Header"/>
                <Moment firebase={firebaseApp}/>
            </Route>

            <footer>
                [footer]
            </footer>
        </div>
    );
}

export default App;
