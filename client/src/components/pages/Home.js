import React, { useState, useEffect } from "react";
import "../css/Home.css";
import axios from "axios";

const API_KEY = "1ea35e703d333e355de5efe6367f873e";

function Home() {
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
    password: ""
  })



  const signUp = () => {
    if (signupData.password == signupData.passwordConfirm && signupData.password.length > 7) {
      console.log("good password, signup front end hit")
      return axios({
        method: 'POST',
        url: '/api/signup',
        data: signupData
      })

    }
  };

  const logIn = () => {
    return axios({
      method: 'POST',
      url: '/api/login',
      data: loginData
    })
  }

  return (
    <div id="home-main-container">
      <div id="home-info">
        <div id="main-logo">
          <h1>decent playlist tool</h1>
        </div>

        <div id="description">
          log in with your spotify and last.fm accounts to create custom
          playlists straight to your spotify. actually discover music.
        </div>
      </div>

      <div id="login-logged-row">
        <div id="logged-decent">
          <div id="login-signup-btns">
            <button
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
              onClick={() => {
                setToggle({ decentSignup: true });
              }}
            >
              sign up
            </button>
          </div>

          <div className="login-signup-drop">
            {toggles.decentLogin ? (
              <div id="login-form">
                <input 
                placeholder="username"
                onChange={(event) => setLoginData({ ...loginData, username: event.target.value})} />
                <input 
                placeholder="password" 
                onChange={(event) => setLoginData({ ...loginData, password: event.target.password})}/>

                <button
                  onClick={() => {
                    setToggle({ decentLogin: false });
                  }}
                >
                  login
                </button>
              </div>
            ) : null}

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
                    onClick={() => {
                      signUp();
                      setToggle({ decentSignup: false, decentLogin: false });
                    }}
                  >
                    sign up
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div id="logged-spotify">
          <button>
            <em>log in to spotify</em>
          </button>
        </div>

        <div id="logged-lastfm">
          <button>
            <em>log in to lastfm</em>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
