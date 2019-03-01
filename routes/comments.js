const express = require('express');
const shortid = require('shortid');
const moment = require('moment');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const commentData = require('../data');

// create the db file if it doesn't exist
// and seed it with data
const adapter = new FileSync('db.json', {
  defaultValue: { comments: commentData },
});

const db = lowdb(adapter);

const router = express.Router();

router.get('/', (req, res) => {
  res.json(commentData);
});

router.get('/:id', (req, res) => {
  const myComment = db.get('comments').find({ id: req.params.id });
  if (myComment) {
    res.json(myComment);
  } else {
    res.status(404).json({ msg: 'Invalid ID' });
  }
  // const myComment = commentData.find(
  //   comment => comment.id === parseInt(req.params.id),
  // );
  // if (myComment) {
  //   res.json(myComment);
  // } else {
  //   res.status(404).json({ msg: 'Invalid ID' });
  // }
});

// create a comment
router.post('/', (req, res) => {
  if (!req.body.text) {
    res.status(400).json({
      msg: 'Invalid ID',
    });
  }
  // create a new comment with the text
  const newComment = {
    text: req.body.text,
    id: shortid.generate(),
    timestamp: moment().format(),
  };

  // timestamp: moment()
  // id: library should be short id
  // add to commentData
  // commentData.push(newComment);

  db.get('comments')
    .push(newComment)
    .write();

  // return all the comments, make sure new comment is included
  res.status(201).json({
    msg: 'Comment successfully added',
    comments: db.get('comments').value(),
  });

  // BONUS: if request has no body text (or text is empty) send proper error code
});

router.put('/:id', (req, res) => {
  if (!req.body.text) {
    return res
      .status(400)
      .json({ msg: 'Invalid syntax: please provide comment text' });
  }
  if (
    !db
      .get('comments')
      .find({ id: req.params.id })
      .value()
  ) {
    return res.status(404).json({ msg: 'Invalid ID' });
  }

  db.get('comments')
    .find({ id: req.params.id })
    .assign({ text: req.body.text })
    .write();

  return res.json(db.get('comments').value());

  // const myComment = commentData.find(
  //   comment => comment.id === parseInt(req.params.id),
  // );
  // const myComment = commentData.find(
  //   comment => comment.id === parseInt(req.params.id),
  // );
  // if (myComment) {
  //   const indexComment = commentData.indexOf(myComment);
  // }

  // if (myComment) {
  //   const indexComment = commentData.indexOf(myComment);

  //   const newComment = {
  //     text: req.body.text,
  //     id: parseInt(req.params.id),
  //     timestamp: moment().format(),
  //   };

  //   commentData.splice(indexComment, 1, newComment);
  //   res.json(commentData);
  // } else {
  //   res.status(404).json({ msg: 'Invalid ID' });
  // }
});

router.delete('/:id', (req, res) => {
  if (
    !db
      .get('comments')
      .find({ id: req.params.id })
      .value()
  ) {
    return res.status(404).json({ msg: 'Invalid ID' });
  }
  db.get('comments')
    .remove({ id: req.params.id })
    .write();

  res.status(200).json({
    msg: 'Comment Successfully Deleted',
    comments: db.get('comments').value(),
  });

  // const myComment = commentData.find(
  //   comment => comment.id === parseInt(req.params.id),
  // );

  // if (myComment) {
  //   const indexComment = commentData.indexOf(myComment);
  //   commentData.splice(indexComment, 1);
  //   // console.log(commentData);
  //   res.json(commentData);
  // } else {
  //   res.status(400).json({ msg: 'Invalid ID' });
  // }
});

module.exports = router;
