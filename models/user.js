const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  username:String,
  googleID:String,
  thumbnail:String,
  points:Number
})

const User = mongoose.model('users',UserSchema);

module.exports = User;
