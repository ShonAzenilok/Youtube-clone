const mongoose = require("mongoose");
const VideosDB = require('./videos');
const Schema = mongoose.Schema;

/*
To add a user you will need to provide a 
unique userName
password
public name
and to upload a profile picture

*/
const userSchema = new Schema({
  userName: { type: String, required: true , unique: true },
  password: { type: String, required: true },
  videos_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'videos' }],
  publicName: { type: String, required: true },
  profilePicPath: { type: String, default : "/" },
  likedvideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'videos' }],
  unlikedvideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'videos' }],
  likedcomments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
  unlikedcomments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
  watched: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
});

const UsersDB = mongoose.model("Users", userSchema);
module.exports = UsersDB;
