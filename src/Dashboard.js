import {Link} from "react-router-dom";
import React from "react";

const Dashboard = () => (
    <nav>
        <ul>
            <li><Link to="/moment/00001">moment 00001</Link></li>
            <li><Link to="/moment/00002">moment 00002</Link></li>
        </ul>
    </nav>
);

export default Dashboard;
