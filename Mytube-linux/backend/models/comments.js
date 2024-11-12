const mongoose = require("mongoose");
const VideosDB = require('./videos');
const users = require('./users');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    videoID: { type: Schema.Types.ObjectId, ref: 'videos', required: true },
    userID: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    userPublicName: { type: String, required: true },
    comment: { type: String, required: true },
    liked: { type: Number, default: 0 },
    unliked: { type: Number, default: 0 }
});

const CommentsDB = mongoose.model("comments", commentsSchema);
module.exports = CommentsDB;