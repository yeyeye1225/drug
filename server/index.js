const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.set("port", process.env.PORT || 8080);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/drug", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const postSchema = mongoose.Schema(
  {
    title: "string",
    contents: "string",
  },
  {
    collection: "post",
  }
);
const Post = mongoose.model("Schema", postSchema);

app.get("/", (req, res) => {
  Post.find().then((posts) => {
    res.send(posts);
  });
});

app.get("/api/get", (req, res) => {
  Post.find().then((posts) => {
    res.send(posts);
  });
});

app.get("/api/select", (req, res) => {
  const { postID } = req.query;
  console.log(postID);
  Post.find({ _id: postID }).then((posts) => {
    res.send(posts);
  });
});

app.delete("/api/delete", (req, res) => {
  const { postID } = req.query;
  Post.deleteOne({ _id: postID }).then(() => {
    //req.method = "GET";
    //    res.redirect("http://google.com");
    res.send("success");
  });
});

app.post("/api/insert", (req, res) => {
  var newPost = new Post(req.body);
  newPost
    .save()
    .then(() => {
      console.log(newPost);
      console.log(req.body.title);
      console.log(req.body.contents);
      res.send("success");
    })
    .catch((err) => {
      console.log("ERROR: " + err);
    });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 서버 실행중..");
});
