import React, { useState, useEffect } from "react";
import "../css/Lastfm.css";
import axios from "axios";
import Cookies from "universal-cookie";
require("dotenv").config();

function Lastfm() {
  const [userData, setUserData] = useState({});
  const [resultsToggle, setResultsToggle] = useState({display: false, content: "artists"})

  const [topArtists, setTopArtists] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [similarTopArtists, setSimilarTopArtists] = useState([]);

  const [lastFmDataPreferences, setLastFmDataPreferences] = useState({
    period: "overall",
    limit: 5,
    method: "gettopartists"
  })

  // cookies
  var cookies = new Cookies();
  let userIdCookieString = document.cookie;
  let userIdCookieArray = userIdCookieString.split("=");
  let userIdCookieValue = userIdCookieArray[1];

  const getInfo = () => {
    if (!isNaN(userIdCookieValue)) {
      axios({
        method: "GET",
        url: `api/users/${userIdCookieValue}`,
      }).then((data) => {
        setUserData(data.data);
        // getTopArtists(data.data.lastfm_username);
        // getTopAlbums(data.data.lastfm_username);
      });
    }
  };

  // last.fm functions

  // const getTopArtists = (username) => {
  //   axios({
  //     method: "GET",
  //     url: `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&limit=${10}&api_key=${
  //       process.env.REACT_APP_LASTFM_KEY
  //     }&format=json`,
  //   }).then((data) => {
  //     setTopArtists(data.data.topartists.artist);
  //     for (let i = 0; i < data.data.topartists.artist.length; i++) {
  //       getSimilarArtists(data.data.topartists.artist[i].mbid);
  //     }
  //   });
  // };

  const getSimilarArtists = (mbid) => {
    axios({
      method: "GET",
      url: `https://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&mbid=${mbid}&limit=${5}&api_key=${
        process.env.REACT_APP_LASTFM_KEY
      }&format=json`,
    }).then((data) => {
      similarTopArtists.push({
        artist: data.data.similarartists["@attr"],
        similar: data.data.similarartists.artist,
      });
      // console.log(similarTopArtists);
    });
  };


  const makeCall = () => {
    axios({
      method: "GET",
      url: `https://ws.audioscrobbler.com/2.0/?method=user.${lastFmDataPreferences.method}&user=${userData.lastfm_username}&period=${lastFmDataPreferences.period}&limit=${lastFmDataPreferences.limit}&api_key=${process.env.REACT_APP_LASTFM_KEY}&format=json`
    }).then(({data}) => {
      setResultsToggle({...resultsToggle, display: true})
      if (lastFmDataPreferences.method === "gettopartists") {
        console.log(data.topartists.artist)
        setResultsToggle({...resultsToggle, content: "artists"})
        setTopArtists(data.topartists.artist)}

      if (lastFmDataPreferences.method === "gettopalbums") {
        console.log(data.topalbums.album)
        setResultsToggle({...resultsToggle, content: "albums"})

      }
      if (lastFmDataPreferences.method === "gettoptracks") {
        console.log(data.toptracks.track)}
        setResultsToggle({...resultsToggle, content: "tracks"})


    })
  }

  const methodSwitch = (method) => {
    switch(method) {
      case 'gettopartists':
        return 'artists';
      case 'gettopalbums':
        return 'albums';
      case 'gettoptracks':
        return 'tracks';
    }
  }


  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div id="options-div">
      <span>What's up {userData.lastfm_username}!</span>

      <div id="options-box">
        <div id="method-dropdown" className="options-column">
        <span>Data</span>
          <select onChange={(event) => setLastFmDataPreferences({...lastFmDataPreferences, method: event.target.value})}>
            <option value="gettopartists">artists</option>
            <option value="gettopalbums">albums</option>
            <option value="gettoptracks">tracks</option>
          </select>
        </div>

        <div id="period-dropdown" className="options-column">
          <span>Period</span>
          <select onChange={(event) => setLastFmDataPreferences({...lastFmDataPreferences, period: event.target.value})}>
            <option value="overall">overall</option>
            <option value="7day">7 days</option>
            <option value="1month">1 month</option>
            <option value="3month">3 months</option>
            <option value="6month">6 months</option>
            <option value="12month">12 months</option>
          </select>
          </div>

          <div id="limit-dropdown" className="options-column">
            <span>Results</span>
          <select onChange={(event) => setLastFmDataPreferences({...lastFmDataPreferences, limit: event.target.value})}>
            <option>{5}</option>
            <option>{10}</option>
            <option>{25}</option>
            <option>{50}</option>
          </select>
          </div>

          <button onClick={() => makeCall()}>submit</button>

      </div>

{  resultsToggle ? <div id="results-box">
    
    {}


    </div> : null }

    </div>
  );
}

export default Lastfm;
