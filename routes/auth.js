const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

router.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Invalid Syntax: Please provide a username and password'
    });
  }
  // Create a new User
  User.create({
    username: req.body.username,
    // TODO: more robust password hashing
    password: req.body.password
  })
    .then(user => {
      const userObj = user.toObject();
      delete userObj.password;
      return res
        .status(201)
        .json({ message: 'User successfully created', user: userObj });
    })
    .catch(err => res.status(500).json(err));
  // req has a body with username and password
});

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Invalid username and password' });
  }
  // find user in the db
  const user = await User.findOne({ username: req.body.username });
  // check to make sure user exists
  if (!user) return res.status(404).json({ message: 'Invalid Username' });
  // compare passwords
  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (isMatch) {
    // sign a jwt
    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day'
    });
    return res.json({
      message: 'Successfully logged in',
      token: `Bear ${token}`
    });
  }
  return res.status(404).json({ message: 'Invalid user name and password!' });
});

module.exports = router;
