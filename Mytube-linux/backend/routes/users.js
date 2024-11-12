const express = require("express");
const userController = require('../controllers/users.js');
const { upload } = require("../multer");

const router = express.Router();



// Get users
router.route("/").get(userController.getUsers);
// logout to anon
router.route("/logout/:id").get(userController.logout);
// Get user by ID
router.route("/:id").get(userController.getUserByID);
// Update user by ID
router.route("/:id").patch(userController.updateUserByID);
// Delete user by ID
router.route("/:id").delete(userController.deleteUserByID);
// Return user's videos
router.route("/:id/videos").get(userController.getUservideo);
// Add a video to a user
router.route("/:id/videos").post(upload, userController.addUserVideo);
// Add a like to video
router.route("/:id/videos/:pid/like").patch(userController.likevideo);
// Add an unlike to video
router.route("/:id/videos/:pid/unlike").patch(userController.unlikevideo);
// Return specific user video
router.route("/:id/videos/:pid").get(userController.getUserVideoByID);
// Update a specific video
router.route("/:id/videos/:pid").patch(userController.updateUserVideoByID);
// Delete specific video
router.route("/:id/videos/:pid").delete(userController.deleteUserVideoByID);
// Create comment from video by ID
router.route("/:id/videos/:pid/comments").post(userController.createCommentfromVideoByID);
// Get comment from video by ID
router.route("/:id/videos/:pid/comments/:cid").get(userController.getCommentfromVideoByID);
// Update comment from video by ID
router.route("/:id/videos/:pid/comments/:cid").patch(userController.updateCommentfromVideoByID);
// Delete comment from video by ID
router.route("/:id/videos/:pid/comments/:cid").delete(userController.deleteCommentfromVideoByID);
// Add like to comment from video by ID
router.route("/:id/videos/:pid/comments/:cid/like").patch(userController.addlike);
// Add unlike to comment from video by ID
router.route("/:id/videos/:pid/comments/:cid/unlike").patch(userController.addunlike);
// Add viewed video to user by user ID and video PID
router.route("/:id/videos/:pid/viewed").patch(userController.addviewd);
// get user watched videos by user
router.route("/:id/videowatch").get(userController.getuserwatched);
// get liked videos by user
router.route("/:id/videoliked").get(userController.getuserliked);
// get all user comments
router.route("/:id/comments").get(userController.getusercomments);

module.exports = router;
