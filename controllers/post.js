const express = require("express");
const router = express.Router();

const db = require("../models");

// base route /

// index route
router.get("/", async (req, res) => {
  try {
    const foundPosts = await db.Post.find({});
    const context = {
      posts: foundPosts
    };
    res.render("posts/index.ejs", context);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// new route
router.get("/newPost", (req, res) => {
  try {
    const context = {
      user: req.session.currentUser,
  }
    res.render("posts/new.ejs", context);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// new comment route
router.get("/:id/newComment", async (req, res) => {
  try {
    const postID = await db.Post.findById(req.params.id);
    const context = {
      user: req.session.currentUser,
      post: postID
  }
    res.render("comments/new.ejs", context);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// Create comment route
router.post("/comments", async (req, res) => {
  try {
    const createdComment = await db.Comment.create(req.body);
    const foundUser = await db.User.findById(req.body.user);
    const foundPost = await db.Post.findById(req.body.post);

    foundUser.comments.push(createdComment);
    await foundUser.save();

    foundPost.comments.push(createdComment);
    await foundPost.save();

    res.redirect(`/posts/${foundPost._id}`);
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal server error" });
  }
});

// create route
router.post("/", async (req, res) => {
  try {
    const createdPost = await db.Post.create(req.body);
    const foundUser = await db.User.findById(req.body.user);

    foundUser.posts.push(createdPost);
    await foundUser.save();

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal server error" });
  }
});

// show
router.get("/:id", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const context = { post: foundPost,
      user: req.session.currentUser,
     };
    res.render("posts/show", context);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const context = { post: foundPost,
      user: req.session.currentUser,
     };
    res.render("posts/edit.ejs", context);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const foundPost = await db.Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/posts/${foundPost._id}`);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    await db.Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

module.exports = router;
