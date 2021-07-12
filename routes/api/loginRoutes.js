const router = require('express').Router();
const { User } = require('../../models');
const sequelize = require('sequelize');

router.post('/', async (req, res) => {
    console.log("Login route hit", req.body)
    try {
        const userData = await User.findOne({ where: { username: req.body.username }});

        console.log("Selected user info: ", userData)

        if (!userData) {
            res
            .status(400)
            .json({ message: "Incorrect username or password, please try again"});
            return
        }
        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
            .status(400)
            .json({ message: "Incorrect password"});
        }

        req.session.save(() => {
            req.session.user_id = userData.isSoftDeleted;
            req.session.logged_in = true;
            req.saession.name = userData.username;
            console.log("Username:", req.session.name)
            res.json({ user: userData, message: 'You are now logged in '});
        })

    } catch (err) {
        res.status(400).json(err);
    }
});



module.exports = router;