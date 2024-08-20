const { Post } = require("../models");

exports.getDashboard = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.session.userId },
      order: [["createdAt", "DESC"]],
    });
    console.log("Retrieved posts:", posts);
    const loggedIn = req.session.loggedIn || false;
    res.render("dashboard", { posts, loggedIn });
  } catch (error) {
    console.error(error);
    res.render("dashboard", { error: "An error occurred" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new post in the database
    await Post.create({
      title,
      content,
      userId: req.session.userId,
    });

    // Redirect to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("dashboard", { error: "An error occurred" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    // Find the post by ID and update its title and content
    await Post.update(
      { title, content },
      { where: { id: postId, userId: req.session.userId } }
    );

    // Redirect to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("dashboard", { error: "An error occurred" });
  }
};

exports.getEditPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post || post.userId !== req.session.userId) {
      return res.redirect("/dashboard");
    }

    // Verify if logged in already.
    const loggedIn = req.session.loggedIn || false;
    res.render("editPost", { post, loggedIn });
  } catch (error) {
    console.error(error);
    res.redirect("/dashboard");
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID and delete it
    await Post.destroy({ where: { id: postId, userId: req.session.userId } });

    // Redirect to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("dashboard", { error: "An error occurred" });
  }
};