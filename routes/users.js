var express = require('express');
var router = express.Router();
const UserModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    // Effectuer l'agrégation pour exclure le champ 'password'
    const users = await UserModel.aggregate([
      {
        $project: {
          password: 0 // Exclut le champ 'password'
        }
      }
    ]);

    // Utiliser .populate() après l'agrégation
    const populatedUsers = await UserModel.populate(users, {
      path: 'savedRecipes', // Remplacez 'relatedField' par le champ que vous souhaitez peupler
      
    });

    res.json({ result: true, users: populatedUsers });
  } catch (err) {
    res.status(500).json({ result: false, message: "An error occurred", error: err });
  }
});


/* POST User register*/
router.post("/register", async (req,res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if(user) {
    return res.json({result: false,  message: "User already exists!"})
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword })
  newUser.save();
  res.json({ result: true, message: "User Registered successfully!"});
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
  res.json({ token, userID: user._id, username: user.username });

})


module.exports = router;



