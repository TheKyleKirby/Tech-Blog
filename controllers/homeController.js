const { Post } = require("../models");

exports.getHomePage = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: ["user"],
    });
    console.log("Retrieved posts:", posts);
    const loggedIn = req.session.loggedIn || false;
    res.render("home", { posts, loggedIn });
  } catch (error) {
    console.error(error);
    res.render("home", { error: "An error occurred" });
  }
};