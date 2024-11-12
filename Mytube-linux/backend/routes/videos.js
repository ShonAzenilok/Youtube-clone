const express = require('express');
const router = express.Router();

const videoController = require('../controllers/videos.js');


//get 20 videos where 10 are the most watched and 10 random #update needed
router.route('/').get(videoController.getVideos);
//post function for the cpp function
router.route('/').post(videoController.getVideoscpp);
//get 20 most watched videos
router.route('/mostwatched').get(videoController.getmostwatched);
//get all videos that fall in the search query req body should get title: "..."
router.route('/search').post(videoController.filterbysearch);
//get a video by id
router.route("/:id").get(videoController.getVideoByID);
//get all video comments to show them under the video
router.route("/:id/comments").get((videoController.getAllComments))



module.exports = router;