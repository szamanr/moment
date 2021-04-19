import React from 'react';
import {FaCogs, FaLongArrowAltLeft, FaStar, FaUserCircle} from 'react-icons/fa'
import {Link, useParams} from "react-router-dom";
import styled from "styled-components";

const StyledHeader = styled.header`
  display: grid;
  place-items: center;
  grid-template-columns: repeat(12, 1fr);

  .button.back {
    grid-column: 1;
  }

  .title {
    grid-column: 4 / 10;
  }
  
  .buttons, .Users {
    grid-column: 11 / 13;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-right: 5px;
  }

  .buttons .button {
    margin: auto 5px;
  }

  .description {
    grid-column: 5 / 11;
    width: 100%;
  }

  .Users .user-icon {
    margin: auto 2px;
  }

`;

const Header = () => {
    const {momentId} = useParams();

    return (
        <StyledHeader className="Header">
            <Link to="/dashboard">
                <span className="button brand back"><FaLongArrowAltLeft/></span>
            </Link>
            <h3 className='title'>moment #{momentId}</h3>
            <div className="buttons">
                <span className="button brand favorite"><FaStar/></span>
                <span className="button brand menu"><FaCogs/></span>
            </div>
            <small className="description">22 april 2020</small>
            <div className="Users">
                <span className="user-icon"><FaUserCircle/></span>
                <span className="user-icon"><FaUserCircle/></span>
                <span className="user-icon"><FaUserCircle/></span>
                <span className="user-icon"><FaUserCircle/></span>
            </div>
        </StyledHeader>
    );
};

export default Header;
