/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]
});

schema.pre('save', async function() {
  // check if password has been updated
  if (this.isModified('password')) {
    // hash it
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(this.password, salt);
    // set user's password to the hash
    this.password = hash;
  }
  // pass it along
});

const User = mongoose.model('user', schema);

module.exports = User;
