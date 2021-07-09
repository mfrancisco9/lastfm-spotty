import React, { useState, useEffect } from "react";
import "../css/Home.css";
import axios from "axios";

const API_KEY = "1ea35e703d333e355de5efe6367f873e";

function Home() {
  const [toggle, setToggle] = useState(false);
  const [albums, setAlbums] = useState({});
  const [topArtists, setTopArtists] = useState([]);
  const [prefs, setPrefs] = useState({
    username: "",
    limit: "5",
    period: "overall",
  });

  const callApi = () => {
    const url = `//ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${prefs.username}&period=${prefs.period}&api_key=${API_KEY}&limit=${prefs.limit}&format=json`;

    axios.get(url).then((data) => {
      var albumData = data.data.topalbums.album;
      setAlbums(albumData);
      setToggle(true);
      var artistArr = [];
      for (let i = 0; i < albumData.length; i++) {
        artistArr.push(albumData[i].artist.name);
        //   sub-loop to prevent duplicate artist names -- in future switching to a unique artist ID would probably be better in case of separate artists with same name.
        for (let j = 0; j < albumData.length; j++) {
          if (data.data.topalbums.album[j].artist.name == artistArr[i] && j != i) {
            artistArr.pop();
          }
        }
      }
      console.log(artistArr);
    });
  };

  return (
    <div id="home-container">
      <h3>Hello{prefs.username ? " " + prefs.username : null}!</h3>

      <div id="inputs">
        <input
          type="text"
          max="50"
          onChange={(event) =>
            setPrefs({ ...prefs, username: event.target.value })
          }
        />
        <span>username</span>
        <br />
        <select
          onChange={(event) =>
            setPrefs({ ...prefs, limit: event.target.value })
          }
        >
          <option>5</option>
          <option>10</option>
          <option>25</option>
        </select>
        <span># of albums</span>
        <br />
        <select
          onChange={(event) =>
            setPrefs({ ...prefs, period: event.target.value })
          }
        >
          <option>overall</option>
          <option>7day</option>
          <option>1month</option>
          <option>3month</option>
          <option>6month</option>
          <option>12month</option>
        </select>
        <span>period</span>
        <br />
        <button
          onClick={() => {
            callApi();
          }}
        >
          Submit
        </button>
      </div>
      <div id="albumbox">
        {toggle
          ? albums.map((album) => (
              <div className="albums">
                <div>
                  {album.artist.name} - {album.name}
                </div>
                <img src={album.image[3]["#text"]} />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default Home;
