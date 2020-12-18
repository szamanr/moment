import React from "react";
import {Route, useHistory, useParams} from "react-router-dom";
import Moment from "./Moment";
import Dashboard from "./Dashboard";
import * as FirestoreService from "./services/firestore";
import Header from "./Header";
import "./App.css";

function App() {
    const history = useHistory();

    // TODO: implement login
    const signIn = function () {
        FirestoreService.authenticate()
            .then(() => {
                history.push('/dashboard');
            });
    }

    return (
        <div className="App">
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route path="/moment/:momentId">
                <Header className="Header"/>
                <Moment/>
            </Route>
            <Route exact path="/">
                {signIn()}
            </Route>
            <footer>
                [footer]
            </footer>
        </div>
    );
}

export default App;
