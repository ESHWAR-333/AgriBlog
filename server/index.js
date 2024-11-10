const express = require("express");
const User = require("./models/User");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const { mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Post = require("./models/Post");
const multer = require("multer");
const uploadMiddleWare = multer({ dest: "uploads/" });
const fs = require("fs");

const app = express();

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

const port = process.env.PORT || 4000;
const secret = process.env.SECRET_KEY;
const mongoUri = process.env.MONGO_URI;

app.use(cors({ credentials: true, origin: process.env.CLIENT_ORIGIN }));
mongoose.connect(mongoUri);

app.post("/register", async (req, res) => {
  const { user, password } = req.body;
  try {
    const userDoc = await User.create({
      username: user,
      password: bcrypt.hashSync(password, salt),
    });
    res.send(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { user, password } = req.body;

  const userDoc = await User.findOne({ username: user });
  const passOK = bcrypt.compareSync(password, userDoc.password);
  if (passOK) {
    jwt.sign({ user, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      else
        res.cookie("token", token).json({
          id: userDoc._id,
          user,
        });
    });
  } else {
    res.status(400).json("Wrong Credentails");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleWare.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  }
});

app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.put("/post", uploadMiddleWare.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("You are not the Author");
      }
      (postDoc.title = title),
        (postDoc.summary = summary),
        (postDoc.content = content),
        (postDoc.cover = newPath ? newPath : postDoc.cover),
        await postDoc.save();
      res.json(postDoc);
    });
  }
});

app.listen("4000", () => {
  console.log("server is running on the port http://localhost:4000");
});
