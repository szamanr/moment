import {Link, useHistory} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import firebase from "firebase";
import {UserContext} from "./providers/UserProvider";

const Dashboard = function () {
    const db = firebase.firestore().collection('moments');
    const [moments, setMoments] = useState([]);
    const user = useContext(UserContext);
    const history = useHistory();

    // fetch a list of moments
    useEffect(() => {
        if (!user) {
            history.push('/');
            return;
        }

        // TODO: keeps making POST calls to fetch the data. should only once
        const unsubscribe = db.where('users', 'array-contains', user.uid)
            .onSnapshot((snapshot) => {
                let momentList = [];

                snapshot.forEach((documentSnapshot) => {
                    const item = documentSnapshot.data();
                    const title = item.title ?? 'moment ' + documentSnapshot.id
                    momentList.push({
                        id: documentSnapshot.id,
                        title
                    });
                });

                setMoments(momentList);
            });

        return function cleanup() {
            unsubscribe();
        }
    });

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
