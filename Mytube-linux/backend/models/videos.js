const mongoose = require("mongoose");
const Users = require('./users');
const CommentsDB = require('./comments'); // Import the Comments model
const Schema = mongoose.Schema;

const videosSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required : true },
    thumbnailPath: { type: String, required: true },
    videoPath: { type: String, required: true },
    uploaderID: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    likes: { type: Number, default: 0 },
    unlikes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    postdate: { type: Date, default: Date.now },
    commentamount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }] // Reference to CommentsDB model
});

const VideosDB = mongoose.model("videos", videosSchema);
module.exports = VideosDB;
