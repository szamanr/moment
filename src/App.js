import React, {useEffect, useState} from "react";
import {Route} from "react-router-dom";
import Moment from "./Moment";
import Dashboard from "./Dashboard";
import Header from "./Header";
import firebase from "firebase/app";
import firebaseConfig from "./firebase.config";
import {AppContainer} from "./styled-components/AppContainer";
import FocusedElement from "./FocusedElement";

function App() {
    const [firebaseApp, setFirebase] = useState(null);
    const [focusedElement, setFocused] = useState(null);

    useEffect(() => {
        // initialise app or use existing one
        if (!firebase.apps.length) {
            setFirebase(firebase.initializeApp(firebaseConfig));
        } else {
            setFirebase(firebase.app());
        }

        firebase.auth().signInWithEmailAndPassword('user1@mailinator.com', 'MomentMoment123#');
    }, []);

    return firebaseApp ? (
        <AppContainer>
            <Route exact path={["/", "/dashboard"]}>
                <Dashboard db={firebaseApp.firestore()}/>
            </Route>

            <Route path="/moment/:momentId">
                <Header className="Header"/>
                <Moment db={firebaseApp.firestore()} setFocused={setFocused}/>
            </Route>

            <Route path="/moment/:momentId/:focusedElementId">
                <FocusedElement focused={focusedElement} setFocused={setFocused}/>
            </Route>

            <footer>
                [footer]
            </footer>
        </AppContainer>
    ) : (<p>[loading...]</p>);
}

export default App;
