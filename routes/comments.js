/* eslint-disable no-underscore-dangle */
const express = require('express');
const passport = require('passport');
const shortid = require('shortid');
const moment = require('moment');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const commentData = require('../data');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');

// create the db file if it doesn't exist
// and seed it with data
const adapter = new FileSync('db.json', {
  defaultValue: { comments: commentData }
});

const db = lowdb(adapter);

const router = express.Router();

router.get('/', (req, res) => {
  Comment.find()
    .where('text')
    .regex(req.query.filter || '')
    .then(comments => res.json(comments));

  // let comments = db.get("comments").value();
  // if (req.query.filter) {
  //   const filterText = req.query.filter;
  //   comments = comments.filter(comment => comment.text.toLowerCase().includes(filterText.toLowerCase()));
  // }
  // res.json(comments);
});

router.get('/:id', (req, res) => {
  Comment.findById(req.params.id)
    .then(comment =>
      comment
        ? res.json(comment)
        : res.status(404).json({ message: 'invalid ID' })
    )
    .catch(err => res.status(500).json(err));

  // const myComment = db.get('comments').find({ id: req.params.id });
  // if (myComment) {
  //   res.json(myComment);
  // } else {
  //   res.status(404).json({ msg: 'Invalid ID' });
  // }
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
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.body.text) {
      return res.status(400).json({ msg: 'Invalid syntax' });
    }

    Comment.create({ text: req.body.text, user: req.user._id })
      .then(comment =>
        User.findByIdAndUpdate(req.user._id, {
          $push: { comments: comment._id }
        })
      )
      .then(() => Comment.find())
      .then(comments =>
        res.status(201).json({
          message: 'Comment successfully added',
          comments
        })
      );
  }
);

// // create a new comment with the text
// const newComment = {
//   text: req.body.text,
//   id: shortid.generate(),
//   timestamp: moment().format()
// };

// // timestamp: moment()
// // id: library should be short id
// // add to commentData
// // commentData.push(newComment);

// db.get('comments')
//   .push(newComment)
//   .write();

// // return all the comments, make sure new comment is included
// res.status(201).json({
//   msg: 'Comment successfully added',
//   comments: db.get('comments').value()
// });

// BONUS: if request has no body text (or text is empty) send proper error code

// findByIdAndUpdate
// findAndUpdate
router.put('/:id', (req, res) => {
  if (!req.body.text) {
    return res
      .status(400)
      .json({ msg: 'Invalid syntax: please provide comment text' });
  }

  Comment.findByIdAndUpdate(req.params.id, { text: req.body.text })
    .then(() => Comment.find())
    .then(comments =>
      res.status(201).json({
        message: 'Comment Updated',
        comments
      })
    )
    .catch(err =>
      res.status(404).json({
        message: 'Invalid Id',
        err
      })
    );
});

// Comment.create({ text: req.body.text })
//   .then(() => Comment.find())
//   .then(comments =>
//     res.status(201).json({
//       message: 'Comment successfully added',
//       comments
//     })
//   );

// if (
//   !db
//     .get('comments')
//     .find({ id: req.params.id })
//     .value()
// ) {
//   return res.status(404).json({ msg: 'Invalid ID' });
// }

// db.get('comments')
//   .find({ id: req.params.id })
//   .assign({ text: req.body.text })
//   .write();

// return res.json(db.get('comments').value());

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

// findByIdAndDelete
router.delete('/:id', (req, res) => {
  Comment.findByIdAndDelete(req.params.id)
    .then(() => Comment.find())
    .then(comments =>
      res.status(200).json({
        message: 'Comment Deleted',
        comments
      })
    )
    .catch(err =>
      res.status(404).json({
        message: 'Invalid Id',
        err
      })
    );
});
// console.log(req.params.id);
// if (
//   !db
//     .get('comments')
//     .find({ id: req.params.id })
//     .value()
// ) {
//   return res.status(404).json({ msg: 'Invalid ID' });
// }
// db.get('comments')
//   .remove({ id: req.params.id })
//   .write();
// res.status(200).json({
//   msg: 'Comment Successfully Deleted',
//   comments: db.get('comments').value()
// });
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

module.exports = router;
