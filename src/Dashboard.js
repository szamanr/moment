import {Link, useHistory} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "./providers/UserProvider";
import * as FirestoreService from "./services/firestore";

const Dashboard = function () {
    const [moments, setMoments] = useState([]);
    const user = useContext(UserContext);
    const history = useHistory();

    // fetch a list of moments
    useEffect(() => {
        if (!user) {
            history.push('/');
            return;
        }

        const unsubscribe = FirestoreService.streamMoments(user, (snapshot) => {
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
    }, [user, history]);

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
