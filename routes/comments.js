const express = require("express");
const commentData = require("../data");
const shortid = require("shortid");
const moment = require("moment");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(commentData);
});

router.get("/:id", (req, res) => {
  const myComment = commentData.find(
    comment => comment.id === parseInt(req.params.id)
  );
  if (myComment) {
    res.json(myComment);
  } else {
    res.status(404).json({ msg: "Invalid ID" });
  }
});

//create a comment
router.post("/", (req, res) => {
  if (!req.body.text) {
    res.status(400).json({
      msg: "Invalid ID"
    });
  }
  //create a new comment with the text
  const newComment = {
    text: req.body.text,
    id: shortid.generate(),
    timestamp: moment().format()
  };

  //timestamp: moment()
  //id: library should be short id
  //add to commentData
  commentData.push(newComment);

  //return all the comments, make sure new comment is included
  res
    .status(201)
    .json({ msg: "Comment successfully added", comments: commentData });

  //BONUS: if request has no body text (or text is empty) send proper error code
});

router.put("/:id", (req, res) => {
  const myComment = commentData.find(
    comment => comment.id === parseInt(req.params.id)
  );

  if (myComment) {
    const indexComment = commentData.indexOf(myComment);

    const newComment = {
      text: req.body.text,
      id: parseInt(req.params.id),
      timestamp: moment().format()
    };

    commentData.splice(indexComment, 1, newComment);
    res.json(commentData);
  } else {
    res.status(404).json({ msg: "Invalid ID" });
  }
});

router.delete("/:id", (req, res) => {
  const myComment = commentData.find(
    comment => comment.id === parseInt(req.params.id)
  );

  if (myComment) {
    const indexComment = commentData.indexOf(myComment);
    commentData.splice(indexComment, 1);
    //console.log(commentData);
    res.json(commentData);
  } else {
    res.status(400).json({ msg: "Invalid ID" });
  }
});

module.exports = router;
