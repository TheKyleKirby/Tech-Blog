const express = require("express");
const router = express.Router();

const authController = require("./authController");
const dashboardController = require("./dashboardController");
const homeController = require("./homeController");
const postController = require("./postController");

router.get("/", homeController.getHomePage);
router.get("/login", (req, res) => res.render("login"));
router.post("/login", authController.login);
router.get("/signup", (req, res) => res.render("signup"));
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);

router.get(
  "/dashboard",
  authController.authenticateUser,
  dashboardController.getDashboard
);
router.post(
  "/dashboard/create",
  authController.authenticateUser,
  dashboardController.createPost
);
router.get(
  "/dashboard/edit/:id",
  authController.authenticateUser,
  dashboardController.getEditPost
);
router.post(
  "/dashboard/update/:id",
  authController.authenticateUser,
  dashboardController.updatePost
);
router.post(
  "/dashboard/delete/:id",
  authController.authenticateUser,
  dashboardController.deletePost
);
router.get("/posts/:id", postController.getPostById);
router.post(
  "/posts/:id/comments",
  authController.authenticateUser,
  postController.createComment
);

module.exports = router;