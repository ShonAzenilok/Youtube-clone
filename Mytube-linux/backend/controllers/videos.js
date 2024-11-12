// controllers/videoController.js
const Video = require('../models/videos');
const Comments = require('../models/comments');
const cppclient = require('../cppclient');

/* statues codes
    200-ok
    2010-created
    500-internal server eror
    404- page not found
*/

const getVideos = async (req, res) => {
    try {
        // Fetch 10 most-watched videos
        const mostWatched = await Video.find().sort({ views: -1 }).limit(10);

        // Fetch 10 random videos
        let randomVideos = await Video.aggregate([{ $sample: { size: 10 } }]);

        // Combine most-watched and random videos, ensuring no duplicates
        let combinedVideos = [...mostWatched, ...randomVideos.filter(rv => !mostWatched.some(mw => mw._id.equals(rv._id)))];

        // Check if we have less than 20 unique videos and fetch more if needed
        while (combinedVideos.length < 20) {
            const additionalVideos = await Video.aggregate([{ $sample: { size: 20 - combinedVideos.length } }]);
            additionalVideos.forEach(video => {
                if (!combinedVideos.some(v => v._id.equals(video._id))) {
                    combinedVideos.push(video);
                }
            });
        }

        res.status(200).json(combinedVideos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ message: "Error fetching videos", error });
    }
};
const filterbysearch = async (req,res) => {
    const {title} = req.body;
    try {
        const regex = new RegExp(title, 'i'); // 'i' makes the search case-insensitive
        const videos = await Video.find({ title: { $regex: regex } });
        res.status(200).json(videos)
    } catch (error) {
        console.error('Error fetching videos by title:', error);
        throw error;
    }

}
const getVideoscpp = async (req, res) => {
    const { id, watchedvideo } = req.body;

    try {
        // Step 1: Fetch the video IDs string using the cppclient function
        const videoIDsString = await cppclient(id, watchedvideo);
        console.log("reccomended:" + videoIDsString)
        let videoArray = [];

        if (videoIDsString != " ") {
        // Step 2: Split the string into an array of video IDs
        const videoIDs = videoIDsString.trim().split(' ');

        // Step 3: Search MongoDB for the videos matching the IDs
        videoArray = await Video.find({ _id: { $in: videoIDs } });
        }
        // Step 4: If the number of videos is smaller than 6, append with popular videos
        if (videoArray.length <= 6) {
            const popularVideos = await Video.find()
                .sort({ views: -1 }) // Sort by views in descending order to get popular videos
                .limit(7 - videoArray.length); // Limit to the number of videos needed to reach 6

            videoArray = videoArray.concat(popularVideos);
        }
       
      

        res.status(200).json(videoArray);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};



const getVideoByID = async (req, res) => {
    const { id } = req.params;
    try {
        const video = await Video.findById(id);
        if (!video) {
            res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: "Error fetching video", error });
    }
};

const getAllComments = async (req, res) => {
    const { id } = req.params; // Extract video ID from request parameters

    try {
        // Find the video by its ID and populate the 'comments' array with 'userID' details
        const video = await Video.findById(id)

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        const comments = []
        for (let index = 0; index < video.comments.length; index++) {
            comments.push(await Comments.findById(video.comments[index]) )
            
        }

        // Respond with the populated comments
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Error fetching comments", error });
    }
};

const getmostwatched = async (req, res) => {
    try {
        // Fetch 20 most-watched videos
        const mostWatched = await Video.find().sort({ views: -1 }).limit(20);

        res.status(200).json(mostWatched);
    } catch (error) {
        console.error("Error fetching most-watched videos:", error);
        res.status(500).json({ message: "Error fetching most-watched videos", error });
    }
};




module.exports = {
    getVideos,
    getVideoByID,
    getAllComments,
    filterbysearch,
    getmostwatched,
    getVideoscpp
    
};
