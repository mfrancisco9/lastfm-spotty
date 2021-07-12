const router = require("express").Router();
const sequelize = require('sequelize');
const { User } = require("../../models");

// router.post('/login', async (req res) => {
//     console.log('login backend route hit')
// })

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

module.exports = router;