const express = require('express');
const session = require('express-session')
require('dotenv').config();
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const sequelize = require('./config/connection');

const PORT = process.env.PORT || 3001
const app = express();

const routes = require('./routes')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// does sess stuff need to go here? who's for sure.

const sess = {
    secret: "forg",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    })
};

app.use(session(sess));
// MUST be after middleware
app.use(routes);

sequelize.sync({ force: false}).then(function () {
    app.listen(PORT, function () {
        console.log(`🤠 ==> API server now on ${PORT}!`)
    })
})