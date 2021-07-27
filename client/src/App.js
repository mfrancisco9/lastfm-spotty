import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./custom.scss";
import Cookies from "universal-cookie";
import axios from "axios";
import Home from "./components/pages/Home";
import Lastfm from "./components/pages/Lastfm";
import Spotify from "./components/pages/Spotify";
import Playlist from "./components/pages/Playlist";
import Header from "./Header";

const md5 = require("md5");

function App() {
  // cookies
  var cookies = new Cookies();
  var userIdCookieString = document.cookie;
  var userIdCookieArray = userIdCookieString.split("=");
  var userIdCookieValue = userIdCookieArray[1];
  console.log(document.cookie);
  // spotify info
  const scopes = [
    "playlist-read-private",
    "user-read-email",
    "user-read-email",
    "user-top-read",
  ];
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const redirectUri = "http://localhost:3000/";
  const clientId = "be0a13c1020044b6a93d95d7b34662ec";
  const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}`;
  const code = new URLSearchParams(window.location.search).get("code");

  const [userData, setUserData] = useState({
    username: "",
  });
  const [topArtists, setTopArtists] = useState([]);

  const getUser = () => {
    console.log("getting user");
    if (!isNaN(userIdCookieValue)) {
      console.log("cookie id isnt not a number");
      axios({
        method: "GET",
        url: `api/users/${userIdCookieValue}`,
      }).then((data) => {
        setUserData(data.data);
        console.log(data.data);
      });
    }
  };

  const getLastFMSession = () => {
    const token = new URLSearchParams(window.location.search).get("token");
    var string =
      "api_key" +
      process.env.REACT_APP_LASTFM_KEY +
      "methodauth.getSessiontoken" +
      token +
      process.env.REACT_APP_LASTFM_SECRET;
    var apiSig = md5(string);
    var apiURL = `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${process.env.REACT_APP_LASTFM_KEY}&token=${token}&api_sig=${apiSig}&format=json`;
    axios({
      method: "GET",
      url: apiURL,
    }).then((data) => {
      console.log(data);
      axios({
        method: "PUT",
        url: `api/users/${userIdCookieValue}`,
        data: {
          lastfm_sessionkey: data.data.session.key,
          lastfm_username: data.data.session.name,
        },
      });
    });
  };

  useEffect(() => {
    getUser();
    if (new URLSearchParams(window.location.search).get("token")) {
      getLastFMSession();
      console.log(userData);
    }

    if (new URLSearchParams(window.location.search).get("code")) {
      console.log(code);
      axios.post("/api/spotify/login/", { code }).then((response) => {
        var token = response.data.accessToken;
        axios
          .get("https://api.spotify.com/v1/me", {
            headers: { Authorization: "Bearer " + token },
          })
          .then((data) => {
            console.log(data);
            axios({
              method: "PUT",
              url: `api/users/${userIdCookieValue}`,
              data: {
                spotify_access_token: token,
                spotify_username: data.data.display_name,
              },
            });
          });
      });
    }
  }, []);

  return (
    <div>
      <Router>
        <Header userData={userData} />
        <Route
          exact
          path="/"
          render={(props) => (
            <Home
              getUser={getUser}
              topArtists={topArtists}
              setTopArtists={setTopArtists}
              userData={userData}
              setUserData={setUserData}
              spotifyUrl={loginUrl}
            />
          )}
        />
        <Route
          exact path="/Lastfm"
          render={(props) => (
            <Lastfm topArtists={topArtists} setTopArtists={setTopArtists} />
          )}
        />
        
        <Route exact path="/Spotify" render={(props) => 
          <Spotify
          topArtists={topArtists}
          userData={userData}
          setTopArtists={setTopArtists}    
          />} />
        
        <Route
        exact path="/playlist" 
        render={(props) => (
          <Playlist
          topArtists={topArtists}
          userData={userData}/>
        )} />
      </Router>
    </div>
  );
}

export default App;
