import React, {useState, useEffect} from "react";
import "../css/Spotify.css";
import axios from "axios";
import Cookies from "universal-cookie";
require("dotenv").config();

function Spotify(props) {
    return (
        <div id="spotify-main" className="container">
            <div id="spotify-profile" classname="row">
                <div id="spotify-profile-name" className="col col-md-8">{props.userData.spotify_username}</div>
                <div id="spotify-profile-image" classname="col col-md-4"></div>
            </div>
        </div>
    )
}

export default Spotify;