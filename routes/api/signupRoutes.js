const router = require('express').Router();
const { User } = require("../../models")
const sequelize = require('sequelize');

router.post('/', async (req, res) => {
    console.log("signup backend hit")
    try { console.log(req.body)

    const userData = await User.create(req.body)

    console.log("User created :", userData)

    req.session.save(() => {
        req.session.user_id = userData.isSoftDeleted;
        req.session.logged_in = true;
        req.session.name = userData.username;
        (console.log(req.session.user_id, req.session.username, req.session.logged_in))
    })
    }
    catch (err) {
        console.log('signup backend error: ', err)
        res.status(400).json(err)
    }
})

module.exports = router;
