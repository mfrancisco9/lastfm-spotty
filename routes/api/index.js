const router = require('express').Router();

const userRoutes = require("./userRoutes")
const signupRoutes = require('./signupRoutes')
const loginRoutes = require('./loginRoutes')

const lastfmRoutes = require("./lastfmRoutes")
const spotifyRoutes = require("./spotifyRoutes");

router.use("/users", userRoutes)
router.use("/spotify", spotifyRoutes)
router.use("lastfm", lastfmRoutes)
router.use("/signup", signupRoutes)
router.use("/login", loginRoutes)

module.exports = router;