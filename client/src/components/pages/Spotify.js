import React, { useState, useEffect } from "react";
import "../css/Spotify.css";
import axios from "axios";
import Cookies from "universal-cookie";
require("dotenv").config();

function Spotify(props) {
  const [spotifyUserInfo, setSpotifyUserInfo] = useState({});
  const [spotifyDataPreferences, setSpotifyDataPreferences] = useState({
    type: "artists",
    time_range: "short_term",
    limit: 5,
  });
  const [spotifyArtists, setSpotifyArtists] = useState([])
  var cookies = new Cookies();
  let userIdCookieString = document.cookie;
  let userIdCookieArray = userIdCookieString.split("=");
  let userIdCookieValue = userIdCookieArray[1];


  const getSpotifyUserInfo = () => {
    console.log(
      "getting spotify user info",
      props.userData.spotify_access_token
    );
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + props.userData.spotify_access_token,
        },
      })
      .then((data) => {
        console.log(data);
        setSpotifyUserInfo({
          username: data.data.display_name,
          img_url: data.data.images[0].url,
        });
      });
  };

  const spotifyGetTopArtists = () => {
      console.log("getting spotify top artists")
      axios
        .get(`https://api.spotify.com/v1/me/top/artists?time_range=${spotifyDataPreferences.time_range}&limit=${spotifyDataPreferences.limit}`, {
            headers: {
                Authorization: "Bearer " + props.userData.spotify_access_token
            }
        }).then((artists) => {
            console.log(artists.data.items)
            setSpotifyArtists([])
            for (let i = 0; i < artists.data.items.length; i++) {
                setSpotifyArtists(spotifyArtists => [...spotifyArtists, artists.data.items[i].name])
            }
        })
  }

const saveArtist = (artist) => {
    const fixedString = artist.replaceAll("%", " ").split("").splice(0, artist.length-4).join("");
    console.log(`saving ${fixedString}`)
    console.log(`props.topArtists: ${props.topArtists}`)
    
    if (props.topArtists.includes(fixedString) === false) {
      props.setTopArtists([...props.topArtists, fixedString]);
    }
}

  const handleDelete = (e) => {
    props.setTopArtists([])
    var selected = document.querySelectorAll('div.spotify-artist-result-selected')
    var btns = document.querySelectorAll('div.btn-hide')
    for (let i = 0; i < selected.length; i++){
      btns[i].className="add-btn";
      selected[i].className="spotify-artist-result"
    }
  }



  useEffect(() => {
    getSpotifyUserInfo();
  }, []);

  return (
    <div id="spotify-main" className="container-fluid">
      
      
      
      <div id="spotify-top-row" className="row">
        <div id="spotify-profile-box" className="col col-md-6">
            <div className="row" id="profile-row">
          <div id="spotify-profile-name" className="col col-md-8">
            {props.userData.spotify_username}
          </div>
          <div id="spotify-profile-image" className="col col-md-4">
            {spotifyUserInfo.img_url ? (
              <img src={spotifyUserInfo.img_url} />
            ) : null}
          </div>
          </div>
        </div>   
        <div id="spotify-criteria-box" className="col col-md-6 container">
            <form id="spotify-criteria-form" className="row">
            <select
              id="spotify-range-input"
              className="spotify-inputs col col-md-4"
              onChange={(e) =>
                setSpotifyDataPreferences({
                  ...spotifyDataPreferences,
                  time_range: e.target.value,
                })
              }
            >
              <option value="short_term">1 month</option>
              <option value="medium_term">6 months</option>
              <option value="long_term">all time</option>
            </select>
            <select
              id="spotify-limit-input"
              className="spotify-inputs col col-md-4"
              onChange={(e) =>
                setSpotifyDataPreferences({
                  ...spotifyDataPreferences,
                  limit: e.target.value,
                })
              }
            >
              <option value="5">top 5 artists</option>
              <option value="10">top 10 artists</option>
              <option value="25">top 25 artists</option>
              <option value="50">top 50 artsts</option>
            </select>
            <button
              id="spotify-form-submit"
              className="spotify-inputs col col-md-4 btn btn-primary"
              onClick={(e) => {
                e.preventDefault()  
                spotifyGetTopArtists()}
            }
            >
              submit
            </button>
          </form>
        </div>
      </div>

    {props.topArtists.length ? 
    <div id="spotify-picked-artists">
        <span className="spotify-picked-item" id="spotify-picked-selected">selected artists:</span>

        {props.topArtists.map((artist) => (
            <div className="spotify-picked-item">{artist}</div>
        ))}

        <span className="spotify-picked-item" id="spotify-picked-clear" onClick={() => handleDelete()}>clear</span> 
    </div> : null }

      <div id="spotify-results-container" className="container">
          <div id="spotify-results-row" className="row">
              {spotifyArtists ? spotifyArtists.map((artist) => (
                  <div className="spotify-artist-result">
                      <span className="spotify-artist-name">{artist}</span>
                      <div
                      className="add-btn"
                      id={`${artist.replaceAll(" ", "%")}-add`}
                      onClick={(e) => {
                        e.target.parentNode.className="spotify-artist-result-selected"
                        e.target.className = "btn-hide";
                        saveArtist(e.target.id);
                      }}
                    >
                      add
                    </div>
                  </div>)) : null }
    
          </div>
      </div>
    </div>
  );
}

export default Spotify;
