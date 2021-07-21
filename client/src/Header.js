import React, { useState, useEffect } from "react";
import "./components/css/Header.css";
import axios from "axios";
import Cookies from "universal-cookie";
require("dotenv").config();

function Header(props) {
  return (

<nav className="navbar navbar-expand-md navbar-light bg-warning">
<a class="navbar-brand" href="#">decent</a>
    <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
        <ul className="navbar-nav mr-auto">
            <li className="nav-item">
                <a className="nav-link" href="#">last.fm</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">spotify</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">dashboard</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">about</a>
            </li>
        </ul>
    </div>
    <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul className="navbar-nav ms-auto">
            <li className="nav-item">
                <a className="nav-link" href="#">last.fm</a>
            </li>
            {props.userData.lastfm_username? <li className="nav-item">
                <a className="nav-link" href="#">{props.userData.lastfm_username}</a>
            </li> : null}
            <li className="nav-item">
                <a className="nav-link" href="#">{props.userData.username}</a>
            </li>
        </ul>
    </div>
</nav>
    
  );
}

export default Header;
