import React, { useState, useEffect } from "react";
import "../css/Lastfm.css";
import axios from "axios";
import Cookies from "universal-cookie";
require("dotenv").config();

function Lastfm(props) {
  const [userData, setUserData] = useState({});
  const [resultsToggle, setResultsToggle] = useState({
    display: false,
    content: "artists",
  });
  const [userTops, setUserTops] = useState([]);
  const [lastFmDataPreferences, setLastFmDataPreferences] = useState({
    period: "overall",
    limit: 5,
  });

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
    console.log("making call");
    axios({
      method: "GET",
      url: `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${userData.lastfm_username}&period=${lastFmDataPreferences.period}&limit=${lastFmDataPreferences.limit}&api_key=${process.env.REACT_APP_LASTFM_KEY}&format=json`,
    }).then(({ data }) => {
        console.log(data.topartists.artist);
        setResultsToggle({ display: true, content: "artists" });
        setUserTops(data.topartists.artist);
      
    });
  };

  const saveArtist = (artist) => {
    console.log("saving ", artist)
    var fixedString = artist.replaceAll("%", " ").split("").splice(0, artist.length-4).join("")
    console.log(`fixed string is ${fixedString}`)
    if (props.topArtists.includes(artist) === false) {
      props.setTopArtists([...props.topArtists, fixedString]); 
    }
    // axios({
    //   method: "PUT",
    //   url: `api/users/save/${userIdCookieValue}`,
    //   data: {
    //     artist_picks: props.topArtists
    //   }
    // })
  };

  const handleDelete = (e) => {
    props.setTopArtists([])
    var selected = document.querySelectorAll('div.artist-result-selected')
    var btns = document.querySelectorAll('div.btn-hide')
    for (let i = 0; i < selected.length; i++){
      btns[i].className="add-btn";
      selected[i].className="artist-result"
    }
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div id="lastfm-body">
      <div id="options-div" className="bg-dark">
        <div id="picks-row row">
          {props.topArtists.length ? (
            <div id="artists-selected-row">
              <span id="selected-info-text" className="selected-artists-string">Selected artists: </span> 
              {props.topArtists.map((artist) => ( <span className="selected-artists-string">{artist}</span>))}
              <span id="selected-save-text" className="selected-artists-string" onClick={() => console.log("save for db")}>save</span>
              <span id="selected-clear-text" className="selected-artists-string" onClick={handleDelete}>clear</span> 
            </div>
          ) : null}
        </div>

        <div id="options-box" className="bg-success row">
         
          <div id="period-dropdown" className="options-column col col-md-4">
            <span>Period</span>
            <select
              onChange={(event) =>
                setLastFmDataPreferences({
                  ...lastFmDataPreferences,
                  period: event.target.value,
                })
              }
            >
              <option value="overall">overall</option>
              <option value="7day">7 days</option>
              <option value="1month">1 month</option>
              <option value="3month">3 months</option>
              <option value="6month">6 months</option>
              <option value="12month">12 months</option>
            </select>
          </div>

          <div id="limit-dropdown" className="options-column col col-md-4">
            <span>Results</span>
            <select
              onChange={(event) =>
                setLastFmDataPreferences({
                  ...lastFmDataPreferences,
                  limit: event.target.value,
                })
              }
            >
              <option>{5}</option>
              <option>{10}</option>
              <option>{25}</option>
              <option>{50}</option>
            </select>
          </div>

          <button
            className="btn btn-light col-md-4"
            onClick={() => {
              makeCall();
            }}
          >
            submit
          </button>
        </div>

        {resultsToggle.display ? (
          <div id="results-row" className="row">
            {userTops.length && resultsToggle.content === "artists"
              ? userTops.map((top) => (
                  <div className="artist-result" href={top.url}>
                    <span className="artist-name">{top.name}</span>
                    <span className="artist-plays">
                      {top.playcount} plays
                    </span>{" "}
                    <div
                      className="add-btn"
                      id={`${top.name.replaceAll(" ", "%")}-add`}
                      onClick={(e) => {
                        e.target.parentNode.className = "artist-result-selected"
                        console.log("e.target.id is: ", e.target.id)
                        e.target.className = "btn-hide";
                        saveArtist(e.target.id);
                      }}
                    >
                      add
                    </div>
                  </div>
                ))
              : null}

            {userTops.length && resultsToggle.content === "albums"
              ? userTops.map((top) => (
                  <div className="albums-item">
                    <span className="album-artist-name">{top.artist.name}</span>
                    <div
                      className="add-btn"
                      id={`${top.artist.name.replaceAll(" ", "%")}-add`}
                      onClick={(e) => {
                        e.target.className = "btn-hide";
                        saveArtist(e.target.id);
                      }}
                    >
                      add
                    </div>
                    <span className="album-name">{top.name}</span>
                  </div>
                ))
              : null}

            {userTops.length && resultsToggle.content === "tracks"
              ? userTops.map((top) => (
                  <div className="tracks-item">
                    <span className="track-artist-name">
                      {top["@attr"].rank}.{" "}
                      {top.artist.name}
                    </span>
                    <div
                      className="add-btn"
                      id={`${top.artist.name.replaceAll(" ", "%")}-add`}
                      onClick={(e) => {
                        e.target.className = "btn-hide";
                        saveArtist(e.target.id);
                      }}
                    >
                      add
                    </div>
                    <span className="track-name">{top.name}</span>
                  </div>
                ))
              : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Lastfm;
