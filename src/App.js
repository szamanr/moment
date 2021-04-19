import React, {useEffect, useState} from "react";
import {Route} from "react-router-dom";
import Moment from "./Moment";
import Dashboard from "./Dashboard";
import Header from "./Header";
import firebase from "firebase/app";
import firebaseConfig from "./firebase.config";
import FocusedElement from "./elements/FocusedElement";
import Spinner from "./Spinner";
import styled from "styled-components";

export const FirestoreContext = React.createContext(null);

export const StyledAppContainer = styled.div`
  display: grid;
  height: 100vh;
  grid-template: repeat(24, 1fr) / auto 1fr auto;

  color: var(--base-color);
  background-color: var(--base-background);

  header {
    grid-row: 1 / 4;
  }

  main {
    grid-row: 4 / 24;
  }

  footer {
    grid-row: 24;
    display: grid;
    place-items: center;
  }

  header, main, footer {
    grid-column: 1 / 3;
  }
`;

const App = () => {
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

    return (firebaseApp) ? (
        <FirestoreContext.Provider value={firebaseApp?.firestore()}>
            <StyledAppContainer>
                <Route exact path={["/", "/dashboard"]}>
                    <Dashboard db={firebaseApp.firestore()}/>
                </Route>

                <Route path="/moment/:momentId">
                    <Header className="Header"/>
                    <Moment db={firebaseApp.firestore()} setFocused={setFocused}/>
                </Route>

                <Route path="/moment/:momentId/:focusedElementType/:focusedElementId">
                    <FocusedElement focused={focusedElement} setFocused={setFocused}/>
                </Route>

                <footer>
                    [footer]
                </footer>
            </StyledAppContainer>
        </FirestoreContext.Provider>
    ) : (<Spinner size='full'/>);
};

export default App;
