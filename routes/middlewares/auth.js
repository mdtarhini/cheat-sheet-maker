const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // check for token:
  if (!token) {
    return res.status(401).json({ msg: "no token, authorization denied" });
  }
  //   verify token:
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    //   Add user from payload:
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
