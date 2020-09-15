import React from 'react';
import './Header.css';

function Header() {
    return (
        <div className="Header">
            <a id='header-back'>⬅</a>
            <h3 id='title'>moment #001</h3>
            <a id='header-favorite'>⭐</a>
            <a id='header-menu'>...</a>
            <small class="description">22 april 2020</small>
        </div>
    );
}

export default Header;
