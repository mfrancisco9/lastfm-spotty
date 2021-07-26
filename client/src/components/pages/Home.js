import React, { useState, useEffect } from "react";
import "../css/Home.css";
import axios from "axios";
import Cookies from "universal-cookie";
require("dotenv").config();

function Home(props) {
  const LASTFM_KEY = "685befed1e858efa8d34ec169041ec63";
  const SPOTIFY_ID = "be0a13c1020044b6a93d95d7b34662ec";
  const SPOTIFY_SECRET = process.env.REACT_APP_SPOTIFY_SECRET;
  const SPOTIFY_SCOPES = 'user-top-read playlist-modify-private playlist-read-private'
  const SPOTIFY_REDIRECT_URI = 'http://localhost:3000'

  const spotifyURL = 'https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + SPOTIFY_ID +
  (SPOTIFY_SCOPES ? '&scope=' + encodeURIComponent(SPOTIFY_SCOPES) : '') +
  '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI);


  console.log(SPOTIFY_ID, SPOTIFY_SCOPES)

  // states
  const [toggles, setToggle] = useState({
    decentLogin: false,
    decentSignup: false,
  });
  const [signupData, setSignupData] = useState({
    username: "", 
    password: "",
    passwordConfirm: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // cookies
  var cookies = new Cookies();
  let userIdCookieString = document.cookie;
  let userIdCookieArray = userIdCookieString.split("=");
  let userIdCookieValue = userIdCookieArray[1];


  // signup and login
  const signUp = () => {
    if (
      signupData.password === signupData.passwordConfirm &&
      signupData.password.length > 7
    ) {
      console.log("good password, signup front end hit");
      return axios({
        method: "POST",
        url: "/api/signup",
        data: signupData,
      });
    }
  };

  const logIn = () => {
    console.log("logging in...")
    console.log(loginData)
    return axios({
      method: "POST",
      url: "/api/login",
      data: loginData,
    })
      .then((success) => {
        alert("Login succesful");
        cookies.set("id", success.data.user.id, { path: "/" });
        props.getUser();
        return window.location.assign("/")
      })
      .catch((err) => {
        alert(err)
        return window.location.assign("/");
      });
  };

  const spotifyLogin = () => {
console.log("placeholder")
  }

  const logOut = () => {
    return axios({
      method: "DELETE",
      url: "/api/login",
    }).then(() => {
      alert("Logout succesful");
      document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return window.location.assign("/");
    });
  };


  return (
    // main logo and description
    <div id="home-body">
    <div id="home-main-container" className="container">
      <div id="home-info" className="row">
        <div id="main-logo" className="col col-md-4">
          <h1>a decent playlist tool</h1>
        </div>

        <div id="description" className="col col-md-8">
          spotify makes weird, clunky playlists that don't really introduce you to new music. a decent playlist tool is an effort to fix that.
        </div>
      </div>
{/* login stuff starts here */}
      <div id="main-home-row" className="row">
    
        <div id="login-signup" className="col col-md-6">
          <div className="btns-row">
            {!userIdCookieValue ? 
            <button className="login-signup-btn btn btn-primary"
            onClick={()=> setToggle({decentLogin: true, decentSignup: false})}
            >login</button> : <span id="greeting">Hello, {props.userData.username}!</span>}
            
            
            {!userIdCookieValue ? 
            <button className="login-signup-btn btn btn-primary"
            onClick={()=> setToggle({decentSignup: true, decentLogin: false})}
            >signup</button> : <button className="login-signup-btn btn btn-primary" onClick={()=>logOut()}>logout</button>}
          </div>
          
          {toggles.decentLogin ?
          <form className="form-row" id="login-form">
            <input 
            onChange={(e) => setLoginData({...loginData, username: e.target.value})}
            placeholder="username"/>
            <input
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            placeholder="password"/>
            <input type="submit" value="login" className="btn btn-primary login-signup-btn" 
            onClick={()=> {
            logIn();
            setToggle({decentLogin: false, decentSignup: false})}}/>
          </form> : null }
            
            {toggles.decentSignup ?
          <form className="form-row" id="signup-form">
            <input 
            onChange={(e)=> setSignupData({...signupData, username: e.target.value})}
            placeholder="username"/>
            <input
            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
            placeholder="password"/>
            <input 
            onChange={(e) => setSignupData({...signupData, passwordConfirm: e.target.value})}
            placeholder="password again"/>
            <input type="submit" value="signup" className="btn btn-primary login-signup-btn"
            onClick={()=> {
              signUp();
              setToggle({decentLogin: false, decentSignup: false})}}/>
          </form> : null }



        </div>

      <div id="spotify-lastfm" className="col col-md-6">
        { userIdCookieValue ?
        <div className="btns-row" >
          {props.userData.spotify_sessionkey ? <span>logged into spotify as {props.userData.spotify_username}</span> : <button onClick={()=> spotifyLogin()} className="external-btn btn btn-primary">login to spotify</button>}
          { props.userData.lastfm_sessionkey ? <span>logged into last.fm as {props.userData.lastfm_username}</span> : <button onClick={()=> (window.location.href=`http://www.last.fm/api/auth/?api_key=${LASTFM_KEY}&cb=http://localhost:3000/`)}className="external-btn btn btn-primary">login to lastfm</button> }
        </div> : <div className="btns-row">log in or sign up to connect spotify and last.fm</div> }
      </div>

      </div>
      </div>




















      <div id="old-shit">
        
        <div id="logged-decent">
          {userIdCookieValue ? (
            <div>
              <span>Hello {props.userData.username}! </span>
              <button className="btn btn-primary" onClick={() => logOut()}>logout</button>
            </div>
          ) : (
            <div id="login-signup">
              <button
              className='btn btn-primary login-btns'
                onClick={() => {
                  setToggle({
                    decentLogin: true,
                    decentSignup: false,
                  });
                }}
              >
                <em>log in to decent</em>
              </button>

              <button
              className="btn btn-primary login-btns"
                onClick={() => {
                  setToggle({ decentSignup: true });
                }}
              >
                sign up
              </button>
            </div>
          )}

          {/* login */}
          
          <div className="login-signup-drop">
            {toggles.decentLogin ? (
              <div id="login-form">
                <input
                  placeholder="username"
                  onChange={(event) =>
                    setLoginData({ ...loginData, username: event.target.value })
                  }
                />
                <input
                  placeholder="password"
                  onChange={(event) =>
                    setLoginData({ ...loginData, password: event.target.value })
                  }
                />

                <button
                className="btn btn-primary"
                  onClick={() => {
                    logIn();
                    setToggle({ decentLogin: false, decentSignup: false });
                  }}
                >
                  login
                </button>
              </div>
            ) : null}

            {/* signup */}
            <div className="login-signup-drop">
              {toggles.decentSignup ? (
                <div id="signup-form">
                  <input
                    placeholder="username"
                    onChange={(event) =>
                      setSignupData({
                        ...signupData,
                        username: event.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="password"
                    onChange={(event) =>
                      setSignupData({
                        ...signupData,
                        password: event.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="password confirm"
                    onChange={(event) =>
                      setSignupData({
                        ...signupData,
                        passwordConfirm: event.target.value,
                      })
                    }
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      signUp();
                      setToggle({ decentSignup: false, decentLogin: false });
                    }}
                  >
                    create account
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {userIdCookieValue ? (
          true ? (
            <div id="logged-spotify">
              <button
              className="btn btn-primary"
                onClick={() => { console.log("spotify button")
                }}
              >
                <em>log in to spotify</em>
              </button>
            </div>
          ) : (
            <div>Logged into Last.fm as</div>
          )
        ) : null}
        {userIdCookieValue ? (
          <div id="logged-lastfm">
            { props.userData.lastfm_sessionkey ? <span>logged into last.fm as {props.userData.lastfm_username}</span> :
            <button
            className="btn btn-primary"
              onClick={() => {
                (window.location.href = `http://www.last.fm/api/auth/?api_key=${LASTFM_KEY}&cb=http://localhost:3000/`)
              }}
            >
              <em>log in to lastfm</em>
            </button> }
          </div>
        ) : null} 
      </div>
    </div>
  );
}

export default Home;
