import React from "react";
import { Link } from 'react-router-dom';
import "./components/css/Header.css";

function Header(props) {
  return (

<nav className="navbar navbar-expand-md navbar-light bg-warning">
<Link class="navbar-brand" to="/">decent</Link>
    <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
        <ul className="navbar-nav mr-auto">
            <li className="nav-item">
                <Link className="nav-link" to="/lastfm">last.fm </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/spotify">spotify</Link>
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
            {props.userData.lastfm_username ? <li className="nav-item">
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
