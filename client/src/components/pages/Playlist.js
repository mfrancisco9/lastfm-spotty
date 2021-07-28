import React, {useState, useEffect} from "react";
import "../css/Playlist.css";
import axios from "axios";
import Cookies from "universal-cookie"
import { getSuggestedQuery } from "@testing-library/react";


function Playlist(props) {

// this takes the comma separated sql artist_picks and makes them into a nice array
    const splitArtistArray = (arr) => {
        var array = arr[0].split(",");
        return array
    }
// spotify only lets us input 5 artists for their reccommend api. oh well. 
    const checkFive = (arr) => {
        if (arr.length > 5) {
            var newArr = arr;
            console.log("More than 5 artists in the array... we gotta trim it down!")
            while (newArr.length > 5) {
                newArr.splice((Math.floor(Math.random()*(newArr.length-1))),1)
            } return newArr;
        }
    }


    const getSimilarAsync = async (artist) => {
        try {
            const resp = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=685befed1e858efa8d34ec169041ec63&limit=10&format=json`);
            var randomNumber = Math.floor(Math.random() * 10)
            var newArtist = resp.data.similarartists.artist[randomNumber].name
            console.log(`${artist} => ${newArtist}`)
            if (randomNumber > 4) {
                return newArtist
            } else return artist
        } catch (err) {
            console.log(err)
        }
    }

    // const getSimilar = (artist) => {
    //     axios({
    //         method: "GET",
    //         url: `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=685befed1e858efa8d34ec169041ec63&limit=10&format=json`
    //     }).then(({data}) => {
    //         var randomNumber = Math.floor(Math.random() * 10)
    //         var newArtist = data.similarartists.artist[randomNumber].name
    //         console.log(`${artist} => ${newArtist}`)
    //         return newArtist
    //     })
    // }

    const theAlgo = () => {
        console.log("running the algorithm... 🖥️🎺🧪💾👽🎹👩‍🔬")
        
        var pickedArtists= checkFive((splitArtistArray(props.userData.artist_picks)))
        console.log(`your ${pickedArtists.length} picked artists (down from ${splitArtistArray(props.userData.artist_picks).length}) are `, pickedArtists)
        
        console.log(`using last.fm's api to swap out a random number of your top 5 artists with similar ones`)


        let newArr = [];
        var promises = pickedArtists.map((artist => getSimilarAsync(artist)))
        
        Promise.all(promises).then((res) => {
            newArr = res;
            console.log(newArr)
        })

     
    }
    


    return (
        <div id="playlist-main-container">

            {/* playlist controls will go here */}
            <div id="playlist-specs-container" className="row">
                <div className="col col-md-4 specs-input">
                    <select>
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                        </select><span>tracks</span>
                </div>
                <div className="col col-md-4 specs-input" id="checkboxes">
                    <div className="checkbox-item">
                    <input type="checkbox" name="instrumental" onChange={(e) => console.log(e.target.checked)} />
                    <label for="instrumental">include instrumental tracks</label>
                    </div>
                    <div className="checkbox-item">
                    <input type="checkbox" name="instrumental" onChange={(e) => console.log(e.target.checked)} />
                    <label for="instrumental">give me popular songs</label>
                    </div>
                    <div className="checkbox-item">
                    <input type="checkbox" name="instrumental" onChange={(e) => console.log(e.target.checked)} />
                    <label for="instrumental">high energy songs please</label>
                    </div>
                </div>
                <div className="col col-md-4 specs-input" id="specs-button"><div className="btn btn-primary" onClick={()=>theAlgo()}>create</div></div>
        
            </div>

            {/* this will populate with artists */}
            <div id="playlist-artists-container">
                <span className="playlist-artists-span" id="making-playlists">making playlists based on:</span> 
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
                <div id="playlist-results-playlist">
                    playlist goes here
                </div>
            </div>











        </div>
    )
}

export default Playlist;