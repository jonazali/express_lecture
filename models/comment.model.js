/* eslint-disable func-names */
const mongoose = require('mongoose');

const schema = mongoose.Schema(
  // schema (blueprint)
  {
    text: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
  },
  {
    timestamps: true
  }
);

schema.pre('find', function() {
  this.populate('user', '-password');
});

const Comment = mongoose.model('comment', schema);

module.exports = Comment;
