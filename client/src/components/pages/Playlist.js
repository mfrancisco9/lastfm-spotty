import React, {useState, useEffect} from "react";
import "../css/Playlist.css";
import axios from "axios";
import Cookies from "universal-cookie"
import { getSuggestedQuery } from "@testing-library/react";


function Playlist(props) {


    const splitArtistArray = (arr) => {
        var array = arr[0].split(",");
        return array
    }

    


    return (
        <div id="playlist-main-container">


            {/* playlist controls will go here */}
            <div id="playlist-specs-container">

            </div>

            {/* this will populate with artists */}
            <div id="playlist-artists-container">
                <span className="playlist-artists-span">making playlists based on artists:</span> 
                {props.userData.artist_picks ? 
                splitArtistArray(props.userData.artist_picks).map((artist) => (
                    <span className="playlist-artists-span">{artist}</span>
                ))
                : <span className="playlist-artists-span">no artists selected</span> }
            </div>

            {/* actual playlist will go here */}
            <div id="playlist-results-container">
                <div id="playlist-results-buttons">
                    <div className="playlist-button">save</div>
                    <div className="playlist-button">clear</div>
                </div>
            </div>











        </div>
    )
}

export default Playlist;