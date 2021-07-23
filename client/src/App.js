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

useEffect(() => {
  getUser();
  if (new URLSearchParams(window.location.search).get("token")){
    getLastFMSession();
    console.log(userData)
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
