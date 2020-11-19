import React from "react";
import {Route, useHistory} from "react-router-dom";
import Moment from "./Moment";
import Dashboard from "./Dashboard";
import * as FirestoreService from "./services/firestore";

function App() {
    const history = useHistory();

    // TODO: implement login
    const signIn = function () {
        FirestoreService.authenticate()
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
                    <Moment/>
                </Route>
                <Route path="/">
                    {signIn()}
                </Route>
            </div>
        </div>
    );
}

export default App;
