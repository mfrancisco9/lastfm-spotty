const router = require('express').Router();
const userRoutes = require("./userRoutes")
const lastfmRoutes = require("./lastfmRoutes")
const spotifyRoutes = require("./spotifyRoutes");

router.use("/users", userRoutes)
router.use("/spotify", spotifyRoutes)
router.use("lastfm", lastfmRoutes)

module.exports = router;