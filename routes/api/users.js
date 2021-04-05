const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const Sheet = require("../../models/Sheet");

/*
route: [POST] /api/users/signup
params: username (required), password (required)
access: public
*/
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  //   check for existing users:
  User.findOne({ username }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const newUser = new User({
      username,
      password,
    });
    // Create salt & hash
    bcrypt.genSalt(10).then((salt) => {
      bcrypt.hash(password, salt).then((hash) => {
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign({ _id: user._id }, process.env.jwtSecret, (err, token) => {
            if (err) throw err;
            res.json({
              user: {
                _id: user._id,
                username: user.username,
              },
              token,
            });
          });
        });
      });
    });
  });
});

/*
route: [POST] /api/users/signin
params: username (required), password (required)
access: public
*/
router.post("/signin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields for signin" });
  }
  //   check if user exists:
  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exists" });
    }

    // validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "invalid credentials" });
      jwt.sign({ _id: user._id }, process.env.jwtSecret, (err, token) => {
        if (err) throw err;
        res.json({
          user: { _id: user._id, username: user.username },
          token,
        });
      });
    });
  });
});

/*
route: [PATCH] /api/users/edit-password
params: old password (required), new password (required)
access: private
*/
router.patch("/edit-password", auth, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ msg: "some required fields are missing" });
  }
  //   check if user exists:
  User.findOne({ _id: req.user._id }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exists" });
    }
    // validate old password
    bcrypt.compare(oldPassword, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "invalid password" });
      //Salt and hash new password
      bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(newPassword, salt).then((hash) => {
          user.password = hash;
          user.save().then((updatedUser) => {
            res.json(updatedUser);
          });
        });
      });
    });
  });
});

/*
route: [DELETE] /api/users/delete-user
params: password (required)
access: private
*/
router.delete("/delete-user", auth, (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ msg: "invalid password" });
  }

  User.findOne({ _id: req.user._id }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exists" });
    }
    // validate old password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "invalid password" });
      //Salt and hash new password
      user.remove().then(() => {
        Sheet.deleteMany({ authorId: req.user._id }).then(() => {
          res.json({
            msg: "User and corresponding sheets deleted successfuly",
          });
        });
      });
    });
  });
});

/*
route: [GET] /api/users/user-info
params: userId (required)
access: public
return: user details without password
*/
router.get("/user-info/:id", (req, res) => {
  User.findById(req.params.id)
    .select("-password") //do not return the password
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).json({ msg: "User not found" });
    });
});

/*
route: [GET] /api/users/user
params: token (embedded in the header)
access: private
return: user details without password
*/
router.get("/user", auth, (req, res) => {
  User.findById(req.user._id)
    .select("-password") //do not return the password
    .then((user) => {
      if (!user) res.status(404).json({ msg: "user was not found" });
      res.json({ user });
    })
    .catch((err) => {
      res.status(404).json({ msg: "user was not found" });
    });
});
module.exports = router;
