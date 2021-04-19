import React from 'react';
import './Header.css';
import {FaCogs, FaLongArrowAltLeft, FaStar, FaUserCircle} from 'react-icons/fa'
import {Link, useParams} from "react-router-dom";

const Header = () => {
    const {momentId} = useParams();

    return (
        <header className="Header">
            <Link to="/dashboard">
                <span className="button brand" id='header-back'><FaLongArrowAltLeft/></span>
            </Link>
            <h3 id='header-title'>moment #{momentId}</h3>
            <div id="header-buttons">
                <span className="button brand" id='header-favorite'><FaStar/></span>
                <span className="button brand" id='header-menu'><FaCogs/></span>
            </div>
            <small className="description">22 april 2020</small>
            <div className="Users">
                <span className="user-icon"><FaUserCircle/></span>
                <span className="user-icon"><FaUserCircle/></span>
                <span className="user-icon"><FaUserCircle/></span>
                <span className="user-icon"><FaUserCircle/></span>
            </div>
        </header>
    );
};

export default Header;
