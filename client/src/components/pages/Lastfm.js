import React, { useState, useEffect } from "react";
import "../css/Lastfm.css";
import axios from "axios";
import Cookies from "universal-cookie";
require("dotenv").config();

function Lastfm(props) {
  const [userData, setUserData] = useState({});
  const [resultsToggle, setResultsToggle] = useState({
    display: false,
    content: "artists"})

  const [userTops, setUserTops] = useState([]);
  // const [similarTopArtists, setSimilarTopArtists] = useState([]);

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
      });
    }
  };

  const makeCall = () => {
    console.log("making call")
    axios({
      method: "GET",
      url: `https://ws.audioscrobbler.com/2.0/?method=user.${lastFmDataPreferences.method}&user=${userData.lastfm_username}&period=${lastFmDataPreferences.period}&limit=${lastFmDataPreferences.limit}&api_key=${process.env.REACT_APP_LASTFM_KEY}&format=json`
    }).then(({data}) => {
      if (lastFmDataPreferences.method === "gettopartists") {
        console.log(data.topartists.artist)
        setResultsToggle({display: true, content: "artists"})
        setUserTops(data.topartists.artist)
      }
      if (lastFmDataPreferences.method === "gettopalbums") {
        console.log(data.topalbums.album)
        setResultsToggle({display: true, content: "albums"})
        setUserTops(data.topalbums.album)
      }
      if (lastFmDataPreferences.method === "gettoptracks") {
        console.log(data.toptracks.track)
        setResultsToggle({display: true, content: "tracks"})
        setUserTops(data.toptracks.track)
      }
    })
  }


  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div id="lastfm-body">
    <div id="options-div" className="bg-dark">
      <span>Getting listening info for last.fm user {userData.lastfm_username}</span>

      <div id="options-box" className="bg-success">
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

          <button className="btn btn-info" onClick={() => {
            makeCall()}}>submit</button>

      </div>

{ resultsToggle.display ? 

    <div id="results-row" className="row">
    {userTops.length && resultsToggle.content === "artists" ? userTops.map((top) => (
    
    <div className="artist-result" href={top.url}>
        <span className="artist-name">{top.name}</span>
        <span className="artist-plays">{top.playcount} plays</span> <div className="add-btn" id={top.name} onClick={(e)=> props.setTopArtists([...props.topArtists, e.target.id])}>add</div>
    </div>)) : null}



    {userTops.length && resultsToggle.content === "albums" ? userTops.map((top) => (
      <div className="albums-item">
        <span className="album-artist-name">{top.artist.name}</span> 
        <div className="add-btn" id={top.artist.name} onClick={(e)=> props.setTopArtists([...props.topArtists, e.target.id])}>add</div>
        <span className="album-name">{top.name}</span></div> 
    )) : null}


    {userTops.length && resultsToggle.content === "tracks" ? userTops.map((top) => (
      <div className="tracks-item">
        <span className="track-artist-name">{top["@attr"].rank}. {top.artist.name}</span>
        <div className="add-btn" id={top.artist.name} onClick={(e) => props.setTopArtists([...props.topArtists, e.target.id])}>add</div>
        <span className="track-name">{top.name}</span></div>
    )) : null}






    </div> : null }

    </div>
    </div>
  );
}

export default Lastfm;
