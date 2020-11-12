import React from "react";
import {Route, useHistory} from "react-router-dom";
import Moment from "./Moment";
import Dashboard from "./Dashboard";
import PhotoService from "./PhotoService";
import NoteService from "./NoteService";
import * as firebase from "firebase";

function App() {
    const history = useHistory();

    // TODO: implement login
    const signIn = function () {
        firebase.auth().signInWithEmailAndPassword('user1@mailinator.com', 'MomentMoment123#')
            .then(() => {
                // TODO: when refreshing a page on moment, it redirects to dashboard. should only happen on home page.
                // using "exact path" doesn't fix it.
                history.push('/dashboard');
            });
    }

    return (
        <div>
            <div>
                <Route exact path="/dashboard" component={Dashboard}/>
                <Route path="/moment/:id">
                    <Moment
                        photoService={new PhotoService()}
                        noteService={new NoteService()}
                    />
                </Route>
                <Route path="/">
                    {signIn()}
                </Route>
            </div>
        </div>
    );
}

export default App;
