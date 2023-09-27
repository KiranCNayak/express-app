const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    required: true,
    type: String,
  },
  refreshToken: String,
  roles: {
    USER: {
      default: 2394,
      type: Number,
    },
    ADMIN: {
      type: Number,
    },
    EDITOR: {
      type: Number,
    },
  },
  username: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
