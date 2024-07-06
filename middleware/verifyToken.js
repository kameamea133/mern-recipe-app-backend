const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
  
  module.exports = verifyToken;
  