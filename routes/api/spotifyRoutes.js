const router = require("express").Router();
const spotifyWebApi = require('spotify-web-api-node')
const cors = require('cors');

const credentials = {
  clientId: "be0a13c1020044b6a93d95d7b34662ec",
  clientSecret: process.env.SPOTIFY_SECRET,
  redirectUri: "http://localhost:3000/",
}

router.post('/login', (req, res) => {
  console.log("hitting the spotify route")
  let spotifyApi = new spotifyWebApi(credentials)
  const code = req.body.code
  spotifyApi.authorizationCodeGrant(code).then((data) => {
    res.json({
      accessToken: data.body.access_token
    })
  }).catch((err) => {
    console.log(err);
    res.sendStatus(400)
  })
})
  
  module.exports = router;