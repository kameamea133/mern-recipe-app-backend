var express = require('express');
var router = express.Router();
const { getAllUsers, registerUser, loginUser } = require('../controllers/usersController');
const verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/', getAllUsers);

/* POST User register */
router.post('/register', registerUser);

/* POST User login */
router.post('/login', loginUser);

module.exports = router;
