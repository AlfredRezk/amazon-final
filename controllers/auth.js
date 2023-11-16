const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const validation = require("../utils/validation");

let inputs = {};

// @URL     GET /auth/login
// @Access  Public
// @Desc    View the login page
exports.getLogin = (req, res, next) => {

  res.render("pages/auth/login", { docTitle: "Login", inputs });
};

// @URL     GET /auth/signup
// @Access  Public
// @Desc    View the signup page
exports.getSignup = (req, res, next) => {

  res.render("pages/auth/signup", {
    docTitle: "Sign-up", inputs});
};

// @URL     POST /auth/signup
// @Access  Public
// @Desc    Process the signup form
exports.postSignup = async (req, res) => {
  const { email, password, password2 } = req.body;
  inputs = req.body;
  // Validation
  const error = validation(req, res, inputs);
  if (error) 
    return res.redirect("/auth/signup");
  

  // Check if that user already exists in the DB
  const userData = await User.findOne({ email: email });

  //if there is a user with this email redirect the user to the signup page
  if (userData) {
    req.flash("error", "User already exists in database!");
    return res.redirect("/auth/signup");
  }
  // if the user is not exists in the db create this user and redirect to login page
  const user = new User({ password, email });
  await user.save();
  req.flash("success", "User successfuly signed up!");
  res.redirect("/auth/login");
};

// @URL     POST /auth/login
// @Access  Public
// @Desc    Process the login form
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  inputs = req.body;
  // Validation
  const error = validation(req, res, inputs);
  if (error) 
        return res.redirect("/auth/login");
  

  // Check if that user already exists in the DB
  const user = await User.findOne({ email: email });
  if (!user) {
    req.flash("error", "User is not exists in database !");
    return res.redirect("/auth/login");
  }
  // login the user
  // Compare the entered password with the stored password in database
  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    req.flash("error", "Invalid credinitals");
    return res.redirect("/auth/login");
  }
  // If password is correct login user / start session
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  req.flash("success", "Logged in successfully!");
  res.redirect("/");
};

// @URL     GET /auth/logout
// @Access  Private
// @Desc    logout a user
exports.getLogout = async (req, res) => {
  await req.session.destroy();
  inputs = {}
  res.redirect("/auth/login");
};

exports.getForgetPassword = async (req, res) => {
  res.render("pages/auth/forgetPassword", { docTitle: "Forget Password" , inputs});
};

exports.postForgetPassword = async (req, res) => {
  inputs = req.body;
  // Validation
  const error = validation(req, res, inputs);
  if (error) 
        return res.redirect("/auth/forgetpassword");


  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "User is not exists in database !");
    return res.redirect("/auth/forgetpassword");
  }
  // Generate a token for the user
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // send email to the user with the reset link
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetpassword/${resetToken}`;
  const html = (
    await fs.readFile("./utils/index.html", { encoding: "utf-8" })
  ).replace("{{email}}", resetUrl);
  console.log(html);
  const message = {
    email: req.body.email,
    subject: "RESET PASSWORD",
    html: html,
  };
  sendMail(message);
  req.flash("success", "Check your email inbox for reset email!");
  res.redirect("/auth/login");
};

exports.getResetPassword = async (req, res) => {

  res.render("pages/auth/resetpassword", {
    docTitle: "Reset Password",
    resetToken: req.params.resetToken,
    inputs
  });
};

exports.postResetPassword = async (req, res) => {

  inputs = req.body;
  // Validation
  const error = validation(req, res, inputs);
  if (error) 
        return res.redirect(`/auth/resetpassword/${req.body.resetToken}`);
  // Hash the token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");
  // Find the user by the reset token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    req.flash("error", "Invalid reset token or expired token");
    return res.redirect("/auth/login");
  }
  // makesure the password and password 2 are equal
  if (req.body.password !== req.body.password2) {
    req.flash("error", "Password not matched");
    return res.redirect(`/auth/resetpassword/${req.body.resetToken}`);
  }
  // Set the new password
  user.password = req.body.password;
  // clear the resetPasswordToken & resetPasswordExpire
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  req.flash("success", "Password Updated!");
  res.redirect("/auth/login");
};
