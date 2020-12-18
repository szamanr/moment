import React, {useEffect} from "react";
import {Route} from "react-router-dom";
import Moment from "./Moment";
import Dashboard from "./Dashboard";
import * as FirestoreService from "./services/firestore";
import Header from "./Header";
import "./App.css";

function App() {
    useEffect(() => {
        FirestoreService.authenticate();
    }, []);

    return (
        <div className="App">
            <Route exact path={["/", "/dashboard"]}>
                <Dashboard/>
            </Route>

            <Route path="/moment/:momentId">
                <Header className="Header"/>
                <Moment/>
            </Route>

            <footer>
                [footer]
            </footer>
        </div>
    );
}

export default App;
