var express = require('express');
var router = express.Router();
const UserModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json('respond with a resource');
});


/* POST User register*/
router.post("/register", async (req,res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if(user) {
    return res.json({ messgage: "User already exists!"})
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword })
  newUser.save();
  res.json({ messgae: "User Registered successfully!"});
})



/* */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username	})

  if(!user) {
    return res.json({ message: "User Doesn't Exist!"})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid) {
    return res.json({ message: "Username or Password is Incorrect" });
  }

  const token = jwt.sign({ id: user._id}, "secret");
  res.json({ token, userID: user._id })
})


module.exports = router;


/* Middleware to verify token */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = verifyToken;
