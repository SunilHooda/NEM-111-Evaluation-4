const express = require("express");
const { PostModel } = require("../models/postSchema");

const postRouter = express.Router();
postRouter.use(express.json());

postRouter.get("/", async (req, res) => {
  const { device1, device2, device3 } = req.query;
  let posts;
  try {
    posts = await PostModel.find();

    if (device1) {
      posts = await PostModel.find({ device: device1 });
    }

    if (device2 && device3) {
      posts = await PostModel.find({ device: device2, device: device3 });
    }

    res.status(201).send(posts);
  } catch (error) {
    res.status(401).send({
      error,
      message: "Something went wrong in getting all Posts",
    });
  }
});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  console.log(payload);
  try {
    const new_post = new PostModel(payload);
    await new_post.save();
    res.send("Created The New Post");
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while creating new post" });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const post = await PostModel.find({ _id: id });
  const userID_in_post = post.userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userID_in_post) {
      res.send({ msg: "You are not authorized to update the post" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("Post is Updtaed");
    }
  } catch (error) {
    console.log(error);
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.find({ _id: id });
  const userID_in_post = post.userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userID_in_post) {
      res.send({ msg: "You are not authorized to delete the post" });
    } else {
      await PostModel.findByIdAndDelete({ _id: id });
      res.send("Post is Deleted");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  postRouter,
};
