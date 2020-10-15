import React from 'react';
import './Header.css';
import {FaLongArrowAltLeft, FaStar, FaBars, FaUserCircle} from 'react-icons/fa'

function Header() {
    return (
        <header className="Header">
            <span className="button brand" id='header-back'><FaLongArrowAltLeft/></span>
            <h3 id='header-title'>moment #001</h3>
            <span className="button brand"  id='header-favorite'><FaStar/></span>
            <span className="button brand" id='header-menu'><FaBars/></span>
            <small className="description">22 april 2020</small>
            <div className="Users">
                <FaUserCircle/> <FaUserCircle/> <FaUserCircle/> <FaUserCircle/>
            </div>
        </header>
    );
}

export default Header;
