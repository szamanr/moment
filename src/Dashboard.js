import {Link} from "react-router-dom";
import React from "react";

const Dashboard = () => (
    <nav>
        <ul>
            <li><Link to="/moment/0001">moment 0001</Link></li>
            <li><Link to="/moment/0002">moment 0002</Link></li>
        </ul>
    </nav>
);

export default Dashboard;
