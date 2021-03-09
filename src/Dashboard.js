import {Link, useHistory} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "./providers/UserProvider";
import * as FirestoreService from "./services/firestore";

const Dashboard = ({firebase}) => {
    const [moments, setMoments] = useState([]);
    const user = useContext(UserContext);
    const history = useHistory();

    // fetch a list of moments
    useEffect(() => {
        if (!user) {
            history.push('/');
            return;
        }

        const unsubscribe = firebase.firestore().collection('moments')
            .where('users', 'array-contains', user.uid)
            .onSnapshot(snapshot => {
                const items = FirestoreService.parseMoments(snapshot);
                setMoments(items);
            });

        return function cleanup() {
            unsubscribe();
        }
    }, [firebase, user, history]);

    const momentLinks = moments.map(({id, title}) => (
        <li key={id}><Link to={"/moment/" + id}>{title}</Link></li>)
    );

    return (
        <nav>
            <ul>
                {momentLinks}
            </ul>
        </nav>
    );
}

export default Dashboard;
