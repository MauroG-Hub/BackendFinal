const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/users/singin", (req, res) => {
  res.render("users/singin");
});

router.post(
  "/users/singin",
  passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/singin",
    failureFlash: true,
  })
);

router.get("/users/singup", (req, res) => {
  res.render("users/singup");
});

router.post("/users/singup", async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  const errors = [];

  if (name.length <= 0) {
    errors.push({ text: "Please insert your name" });
  }
  if (email.length <= 0) {
    errors.push({ text: "Please insert your email" });
  }
  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match" });
  }
  if (password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/singup", {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  } else {
    const emailUser = await User.findOne({ email: email }).lean();
    if (emailUser) {
      errors.push({ text: "Email already in use" });
      res.render("users/singup", { errors });
    } else {
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered");
      res.redirect("/users/singin");
    }
  }
});

router.get("/auth/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    res.redirect("/");
  });
});

module.exports = router;
