// controllers/usersController.js

const UserModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.aggregate([
      {
        $project: {
          password: 0 
        }
      }
    ]);

    const populatedUsers = await UserModel.populate(users, {
      path: 'savedRecipes', 
    });

    res.json({ result: true, users: populatedUsers });
  } catch (err) {
    res.status(500).json({ result: false, message: "An error occurred", error: err });
  }
};

const MAX_USERS = 50;


const registerUser = async (req, res) => {
  const { username, password } = req.body;

 
  const userCount = await UserModel.countDocuments();
  if (userCount >= MAX_USERS) {
    return res.json({ result: false, message: "User limit reached. No more users can be registered." });
  }

  const user = await UserModel.findOne({ username });
  if (user) {
    return res.json({ result: false, message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  newUser.save();
  res.json({ result: true, message: "User Registered successfully!" });
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.json({ message: "User Doesn't Exist!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "Username or Password is Incorrect" });
  }

  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id, username: user.username });
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser
};
