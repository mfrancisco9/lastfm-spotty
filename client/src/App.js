import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import "./custom.scss"
import Cookies from "universal-cookie";
import axios from "axios"
import Home from './components/pages/Home';
import Lastfm from './components/pages/Lastfm';
import Spotify from './components/pages/Spotify';
import Header from './Header'

const md5 = require('md5')

function App() {

// cookies
var cookies = new Cookies();
var userIdCookieString = document.cookie;
var userIdCookieArray = userIdCookieString.split("=");
var userIdCookieValue = userIdCookieArray[1];
console.log(document.cookie)
// spotify info
// const SCOPES = ['playlist-read-private', 'user-read-email', 'user-read-email', 'user-top-read'];
// const SPOTIFY_CLIENT_ID = "be0a13c1020044b6a93d95d7b34662ec";
// const SPOTIFY_REDIRECT = "http://localhost:3000/"
// const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize"


const [userData, setUserData] = useState({
  username: "",
})
const [topArtists, setTopArtists] = useState([]);


const getUser = () => {
  console.log("getting user")
  if (!isNaN(userIdCookieValue)) {
    console.log("cookie id isnt not a number")
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
  var string = "api_key" + process.env.REACT_APP_LASTFM_KEY + "methodauth.getSessiontoken" + token + process.env.REACT_APP_LASTFM_SECRET
  var apiSig = md5(string)
  var apiURL = `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${process.env.REACT_APP_LASTFM_KEY}&token=${token}&api_sig=${apiSig}&format=json`
  axios({
    method: "GET",
    url: apiURL
  }).then((data) => {
    console.log(data)
    axios({
      method: "PUT",
      url: `api/users/${userIdCookieValue}`,
      data: { 
        lastfm_sessionkey: data.data.session.key,
        lastfm_username: data.data.session.name
      }
    })
  })
}

const setSpotifyData = (access_token) => {
  axios({
    method: "GET",
    url: "https://api.spotify.com/v1/me",
    headers: { Authorization: `Bearer ${access_token}`}
  }).then(({data}) => {
    console.log(data)
    axios({
      method: "PUT",
      url: `api/users/${userIdCookieValue}`,
      data: {spotify_username: data.display_name}
    })
  })
  
  axios({
    method: "PUT",
    url: `api/users/${userIdCookieValue}`,
    data: {
      spotify_access_token: access_token
    }
  })
}

const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHash = hash.substring(1);
  const paramsInUrl = stringAfterHash.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulator, currentValue) => {
    console.log(currentValue);
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    return accumulator
}, {});
return paramsSplitUp;
};

useEffect(() => {
  getUser();
  if (new URLSearchParams(window.location.search).get("token")){
    getLastFMSession();
    console.log(userData)
  }
  if (window.location.hash) {
    const { access_token, expires_in, token_type} =
    getReturnedParamsFromSpotifyAuth(window.location.hash);
    setSpotifyData(access_token);

    // localStorage.clear();
    // localStorage.setItem("accessToken", access_token);
    // localStorage.setItem("tokenType", token_type);
    // localStorage.setItem("expiresIn", expires_in);
  }
}, []);

  return (
    <div>
    <Header userData={userData} />
    <Router>
  <Route 
  exact path = '/' 
  render ={(props) => ( <Home getUser={getUser}topArtists={topArtists} setTopArtists={setTopArtists} userData={userData} setUserData={setUserData}/> )} />
  <Route 
  exact path = '/Lastfm' 
  render ={(props) => ( <Lastfm topArtists={topArtists} setTopArtists={setTopArtists} />)} />
  <Route
  exact path = '/Spotify'
  render ={(props) => <Spotify />} />
  </Router>
  </div>
  );
}

export default App;
