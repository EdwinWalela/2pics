const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
   body:String,
   username:String,
   userID:String,
   time:Date,
   points:Number,
   thumb:String
})

const Post = mongoose.model('posts',PostSchema);

module.exports = Post;
