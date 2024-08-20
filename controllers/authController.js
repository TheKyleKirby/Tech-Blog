const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Op } = require("sequelize");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.render("login", { error: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", { error: "Invalid username or password" });
    }

    // If the passwords match, create a session and set the loggedIn variable
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.loggedIn = true;

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("login", { error: "An error occurred" });
  }
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      return res.render("signup", {
        error: "Username or email already exists",
      });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Create a session and set the loggedIn variable
    req.session.userId = newUser.id;
    req.session.username = newUser.username;
    req.session.loggedIn = true;

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("signup", { error: "An error occurred" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
};

exports.authenticateUser = (req, res, next) => {
  // Check if the user is authenticated
  if (req.session.userId) {
    // If authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // If not authenticated, redirect to the login page
    res.redirect("/login");
  }
};