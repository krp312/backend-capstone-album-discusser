'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const genreSchema = mongoose.Schema({
  name: { type: String, required: true }
});

const albumSchema = mongoose.Schema(
  {
    name:   { type: String, required: true },
    artist: { type: String, required: true },
    tags: [], // { type: enum }
    ratings: {
      'one':   { type: Number, default: 0 },
      'two':   { type: Number, default: 0 },
      'three': { type: Number, default: 0 },
      'four':  { type: Number, default: 0 },
      'five':  { type: Number, default: 0 }
    },
    comments: []
  },
  { timestamps: true }
);

const userSchema = mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    admin: {type: Boolean, required: true, default: false}
  }
);


  // {
  //   "username": "krp312",
  //   "password": "bananas",
  //   "firstName": "Kris",
  //   "lastName": "Panahon",
  //   "admin": false
  // }

  //   {
  //   "username": "bball4lyf",
  //   "password": "96bulls",
  //   "firstName": "Michael",
  //   "lastName": "Jordan",
  //   "admin": false
  // }

  //   {
  //   "username": "mscott",
  //   "password": "dundermifflin",
  //   "firstName": "Michael",
  //   "lastName": "Scott",
  //   "admin": true
  // }

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// blogPostSchema.virtual('authorName').get(function() {
//   return `${this.author.firstName} ${this.author.lastName}`.trim();
// });

// blogPostSchema.methods.apiRepr = function() {
//   return {
//     id: this._id,
//     author: this.authorName,
//     content: this.content,
//     title: this.title,
//     created: this.created
//   };
// };

userSchema.methods.apiRepr = function() {
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

const Album = mongoose.model('Album', albumSchema);
const User = mongoose.model('User', userSchema);
const Genre = mongoose.model('Genre', genreSchema);

module.exports = { Album, User, Genre };