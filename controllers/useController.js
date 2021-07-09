const db = require('../models')

module.exports = {
    findAllUsers: (req, res) => {
        db.User
        .findAll.then(userData => res.json(userData))
    }
}