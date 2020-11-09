import React from 'react';
import './Header.css';
import {FaCogs, FaLongArrowAltLeft, FaStar, FaUserCircle} from 'react-icons/fa'
import {Link} from "react-router-dom";

function Header() {
    return (
        <header className="Header">
            <Link to="/">
                <span className="button brand" id='header-back'><FaLongArrowAltLeft/></span>
            </Link>
            <h3 id='header-title'>moment #001</h3>
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
}

export default Header;
