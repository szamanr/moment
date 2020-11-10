import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import firebase from "firebase";

const Dashboard = function () {
    const db = firebase.database().ref('moments');
    const [moments, setMoments] = useState([]);

    // fetch a list of moments
    useEffect(() => {
        db.on('value', (snapshot) => {
            let momentList = [];
            const items = snapshot.val() ?? {};

            Object.keys(items).forEach((id) => {
                let title = items[id].meta.title ?? 'moment ' + id;
                momentList.push({
                    id,
                    title
                });
            });

            setMoments(momentList);
        });

        return function cleanup() {
            db.off('value');
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
