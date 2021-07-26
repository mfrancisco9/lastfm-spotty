const router = require("express").Router();
const sequelize = require('sequelize');
const { User } = require("../../models");

// get one user
router.get("/:id", async (req, res) => {
    try {
      const userData = await User.findByPk(req.params.id);
  
      if (!userData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
  
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.put('/:id', (req, res) => {
  console.log("hitting the user put route")
  User.update({
    lastfm_username: req.body.lastfm_username,
    lastfm_sessionkey: req.body.lastfm_sessionkey,
    spotify_username: req.body.spotify_username,
    spotify_access_token: req.body.spotify_access_token,
    spotify_refresh_token: req.body.spotify_refresh_token
  },
  {where: {id: req.params.id}}
  ).then(updatedUser => res.json(updatedUser)).catch(error => res.json(error))
})

router.put('/save/:id', (req, res) => {
  User.update({
  artist_picks: [req.body.artist_picks]
  },
  {where: {id: req.params.id}}
  ).then(updatedUser => res.json(updatedUser)).catch(error => res.json(error))
})



module.exports = router;

