import React from "react";
import {Link, Route} from "react-router-dom";
import Moment from "./Moment";
import Dashboard from "./Dashboard";
import PhotoService from "./PhotoService";
import NoteService from "./NoteService";

function App() {
    return (
        <div>
            <div>
                <Route exact path="/" component={Dashboard}/>
                <Route path="/moment/:id">
                    <Moment
                        photoService={new PhotoService()}
                        noteService={new NoteService()}
                    />
                </Route>
            </div>
        </div>
    );
}

export default App;
