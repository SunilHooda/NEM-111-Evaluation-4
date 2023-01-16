const express = require("express");
const { UserModel } = require("../models/userSchema");

require("dotenv").config();
const SecretKey = process.env.SecretKey;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();
userRouter.use(express.json());

// userRouter.get("/", async (req, res) => {
//   const user = await UserModel.find();
//   res.send(user);
// });

userRouter.post("/register", async (req, res) => {
  const { email, password, name, gender } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hashed_password) => {
      if (err) {
        console.log(err, "While hashing the password");
      } else {
        const user = new UserModel({
          name,
          email,
          gender,
          password: hashed_password,
        });
        await user.save();
        res.send({ msg: "Registeration Successfull" });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ err: "Something went wrong while registeration" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    // console.log(user)
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, SecretKey); // secretkey = masai
          res.send({ msg: "Login Successfull", token: token });
        } else {
          console.log(err);
          res.send("Wrong Credntials");
        }
      });
    } else {
      res.send("Wrong Credntials");
    }
  } catch (error) {
    console.log(error);
    res.send("Something went wrong while logging in");
  }
});

module.exports = { userRouter };
