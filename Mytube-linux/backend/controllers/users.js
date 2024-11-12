const fs = require('fs/promises'); // Import promises-based file system module
const path = require('path');
const mongoose = require("mongoose");
const User = require('../models/users');
const CommentsDB = require('../models/comments');
const Video = require('../models/videos');
const { uploadVideos, uploadImages, uploadProfilePics } = require('../multer'); // Adjust the path


const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};


const logout = async (req, res) => {
    try {
        // Fetch the user by ID
        const user = await User.findById('000000000000000000000000');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Handle actual logout logic (e.g., invalidating tokens, clearing sessions)
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

const getUserByID = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

const updateUserByID = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        // Use findByIdAndUpdate to update a user by ID
        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};


const deleteUserByID = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

const getUservideo = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const uservideolist = user.videos_id;
        const videolist = await Promise.all(uservideolist.map(videoId => Video.findById(videoId)));

        res.status(200).json(videolist);
    } catch (error) {
        console.error("Error fetching user videos:", error);
        res.status(500).json({ message: "Error fetching user videos", error });
    }
};

const addUserVideo = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body; // Assuming title and description are sent in the request body

    const videoFile = req.files['uploadVideo'] ? req.files['uploadVideo'][0].path : null;
    const thumbnailFile = req.files['uploadImage'] ? req.files['uploadImage'][0].path : null;

    try {
        // Assuming req.files contains information about the uploaded files
        const newVideo = new Video({
            title,
            description,
            uploaderID : id.toString(),
            videoPath: videoFile, // Path to the uploaded video file
            thumbnailPath: thumbnailFile, // Path to the uploaded thumbnail file
        });

        // Save the new video to the database
        await newVideo.save();

        // Update user with the new video ID
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $push: { videos_id: newVideo._id } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found",error });
        }

        res.status(201).json(newVideo); // Respond with the newly created video

    } catch (error) {
        console.error("Error adding video to user:", error);
        res.status(500).json({ message: "Error adding video to user", error });
    }
};

const getUserVideoByID = async (req, res) => {
    const { id, pid } = req.params; // Extract user ID and video ID from request parameters

    try {
        // Find the user by ID and populate the 'videos_id' array with actual Video documents
        const user = await User.findById(id).populate('videos_id');

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        

        // Find the video by ID from the user's videos_id array
        const userVideo = user.videos_id.find(video => video._id.toString() === pid);
     

        // Check if the video exists
        if (!userVideo) {
            return res.status(404).json({ message: "User video not found" });
        }
        
        res.json(userVideo); // Respond with the found video
    } catch (error) {
        console.error("Error fetching user video:", error);
        res.status(500).json({ message: "Error fetching user video", error });
    }
};


const updateUserVideoByID = async (req, res) => {
    const { id, pid } = req.params; // Extract user ID and video ID from request parameters
    const updatedVideoData = req.body; // Extract the updated video data from request body

    //**Need to make sure the video belongs to user**//
    try {
        // Find the video by ID and update it with the new data
        const updatedVideo = await Video.findByIdAndUpdate(
            pid,
            updatedVideoData,
            { new: true, runValidators: true }
        );

        // Check if video was not found
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.json(updatedVideo); // Respond with the updated video document
    } catch (error) {
        console.error("Error updating user video:", error);
        res.status(500).json({ message: "Error updating user video", error });
    }
};

const deleteUserVideoByID = async (req, res) => {
    const { id, pid } = req.params; // Extract user ID and video ID from request parameters

    try {
        // Find and delete all comments associated with the video
        await CommentsDB.deleteMany({ videoID: pid }); // Ensure 'videoId' corresponds to your schema

        // Find and delete the video by ID
        const deletedVideo = await Video.findByIdAndDelete(pid);

        // Check if video was not found
        if (!deletedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }
           // Update the user document to remove the video ID from the videos_id array
           const updatedUser = await User.findByIdAndUpdate(
            id,
            { $pull: { videos_id: pid } },
            { new: true }
        );

        // Check if user was not found
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the video file from the filesystem
        const videoFilePath = deletedVideo.videoPath; // Assuming videoPath is a field in your Video schema
        if (videoFilePath) {
            await fs.unlink(videoFilePath); // Delete the video file
        }

        // Delete the thumbnail file from the filesystem
        const thumbnailFilePath = deletedVideo.thumbnailPath; // Assuming thumbnailPath is a field in your Video schema
        if (thumbnailFilePath) {
            await fs.unlink(thumbnailFilePath); // Delete the thumbnail file
        }

     

        res.json({ message: "User video and associated comments deleted successfully" });
    } catch (error) {
        console.error("Error deleting user video:", error);
        res.status(500).json({ message: "Error deleting user video", error });
    }
};
const getCommentfromVideoByID = async (req, res) => {
    const { id, pid, cid } = req.params; // Extract user ID, video ID, and comment ID from request parameters

    try {
         // Check if the user exists
         const user = await User.findById(id);
         if (!user) {
             return res.status(404).json({ message: "User not found" });
         }
 
         // Check if the video exists in the user's videos_id array
         const isVideoInUser = user.videos_id.some(videoId => videoId.toString() === pid);
         if (!isVideoInUser) {
             return res.status(404).json({ message: "Video not found for the user" });
         }
 
         // Find the video details
         const video = await Video.findById(pid);
         if (!video) {
             return res.status(404).json({ message: "Video details not found" });
         }
 
         // Find the index of the comment within the video's comments array
         const commentIndex = video.comments.findIndex(comment => comment._id.toString() === cid);
         if (commentIndex === -1) {
             return res.status(404).json({ message: "Comment not found in the video" });
         }

         const comment = await CommentsDB.findById(cid)
 

        res.status(200).json(comment); // Respond with the found comment
    } catch (error) {
        console.error("Error fetching comment from video:", error);
        res.status(500).json({ message: "Error fetching comment from video", error });
    }
};

const updateCommentfromVideoByID = async (req, res) => {
    const { id, pid, cid } = req.params; // Extract user ID, video ID, and comment ID from request parameters
    const comment = req.body; // Extract updated comment data from request body

    try {
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {     
            return res.status(404).json({ message: "User not found" });
        }

        // Find the video details
        const video = await Video.findById(pid);
        if (!video) {
            return res.status(404).json({ message: "Video details not found" });
        }

        // Find the index of the comment within the video's comments array
        const commentIndex = video.comments.findIndex(comment => comment._id.toString() === cid);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found in the video" });
        }

        // Update the comment in the database
        const updatedComment = await CommentsDB.findByIdAndUpdate(cid, comment, { new: true });
        if (!comment) {
            return res.status(404).json({ message: "Failed to update comment" });
        }

        //**Also here, have a proble */
        res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        console.error("Error updating comment in video:", error);
        res.status(500).json({ message: "Error updating comment in video", error });
    }
};

const deleteCommentfromVideoByID = async (req, res) => {
    const { id, pid, cid } = req.params; // Extract user ID, video ID, and comment ID from request parameters

    try {
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the video details
        const video = await Video.findById(pid);
        if (!video) {
            return res.status(404).json({ message: "Video details not found" });
        }

        // Find the index of the comment within the video's comments array
        const commentIndex = video.comments.findIndex(comment => comment._id.toString() === cid);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found in the video" });
        }

        // Remove the comment from the comments array
        video.comments.splice(commentIndex, 1);

        // Save the updated video document
        await video.save();

        // Update the video in the database to decrement commentamount
        const updatedVideo = await Video.findByIdAndUpdate(
            pid,
            { $inc: { commentamount: -1 } },
            { new: true }
        );

       

        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found or updated" });
        }
        await CommentsDB.findByIdAndDelete(cid);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment from video:", error);
        res.status(500).json({ message: "Error deleting comment from video", error });
    }
};

// to create a comment give the comment in the post req
const createCommentfromVideoByID = async (req, res) => {
    
    const { id, pid } = req.params; // Extract user ID and video ID from request parameters
    const { comment } = req.body; // Extract comment text from request body
        if (id === '000000000000000000000000') {
            return res.status(404).json({message :"Please login to comment"})
        }

    try {
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
         
            return res.status(404).json({ message: "User not found" });
        }

        // Find the video details
        const video = await Video.findById(pid);
        if (!video) {
            return res.status(404).json({ message: "Video details not found" });
        }

        // Validate that comment is provided
        if (!comment) {
            return res.status(400).json({ message: "Comment is required" });
        }

        // Create a new comment document in the CommentsDB collection
        const newComment = new CommentsDB({
            videoID: pid,
            userID: id,
            userPublicName: user.publicName, // Assuming `publicName` is a property of the User model
            comment: comment,
            likes: 0,
            unlikes: 0,
        });

        // Save the new comment
        await newComment.save();

             // Update the video document in Videos collection
             const updatedVideo = await Video.findByIdAndUpdate(
                pid,
                { 
                    $push: { comments: newComment._id }, 
                    $inc: { commentamount: 1 } 
                },
                { new: true }
            );
    
        
        res.status(201).json({ message: "Comment created successfully", newComment });
    } catch (error) {
        console.error("Error creating comment in video:", error);
        res.status(500).json({ message: "Error creating comment in video", error });
    }
};

const addlike = async (req, res) => {
    const { id, pid, cid } = req.params;

    try {
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the comment is already liked
        const likedIndex = user.likedcomments.indexOf(cid);
        if (likedIndex !== -1) {
            // Remove the comment ID from the likedcomments array
            user.likedcomments.splice(likedIndex, 1);
            await user.save();

            // Decrement the liked count of the comment
            const updatedComment = await CommentsDB.findByIdAndUpdate(
                cid,
                { $inc: { liked: -1 } },
                { new: true } // Return the updated document
            );

            return res.status(200).json({ message: "Comment like removed successfully", updatedComment });
        }

        // Check if the comment is unliked
        const unlikedIndex = user.unlikedcomments.indexOf(cid);
        if (unlikedIndex !== -1) {
            // Remove the comment ID from the unlikedcomments array
            user.unlikedcomments.splice(unlikedIndex, 1);
            // Decrement the unliked count of the comment
            await CommentsDB.findByIdAndUpdate(cid, { $inc: { unliked: -1 } });
        }

        // Add the comment ID to the likedcomments array
        user.likedcomments.push(cid);
        await user.save();

        // Increment the liked count of the comment
        const updatedComment = await CommentsDB.findByIdAndUpdate(
            cid,
            { $inc: { liked: 1 } },
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: "Comment liked successfully", updatedComment });
    } catch (error) {
        console.error("Error liking comment in video:", error);
        res.status(500).json({ message: "Error liking comment in video", error: error.message });
    }
};


const addunlike = async (req, res) => {
    const { id, pid, cid } = req.params;

    try {
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the comment is already unliked
        const unlikedIndex = user.unlikedcomments.indexOf(cid);
        if (unlikedIndex !== -1) {
            // Remove the comment ID from the unlikedcomments array
            user.unlikedcomments.splice(unlikedIndex, 1);
            await user.save();

            // Decrement the unliked count of the comment
            const updatedComment = await CommentsDB.findByIdAndUpdate(
                cid,
                { $inc: { unliked: -1 } },
                { new: true } // Return the updated document
            );

            return res.status(200).json({ message: "Comment unlike removed successfully", updatedComment });
        }

        // Check if the comment is liked
        const likedIndex = user.likedcomments.indexOf(cid);
        if (likedIndex !== -1) {
            // Remove the comment ID from the likedcomments array
            user.likedcomments.splice(likedIndex, 1);
            // Decrement the liked count of the comment
            await CommentsDB.findByIdAndUpdate(cid, { $inc: { liked: -1 } });
        }

        // Add the comment ID to the unlikedcomments array
        user.unlikedcomments.push(cid);
        await user.save();

        // Increment the unliked count of the comment
        const updatedComment = await CommentsDB.findByIdAndUpdate(
            cid,
            { $inc: { unliked: 1 } },
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: "Comment unliked successfully", updatedComment });
    } catch (error) {
        console.error("Error unliking comment in video:", error);
        res.status(500).json({ message: "Error unliking comment in video", error: error.message });
    }
};

const mutex = {
    lock: false,
    queue: [],
};

// Function to acquire the mutex lock
const acquireLock = async () => {
    return new Promise((resolve) => {
        const tryAcquire = () => {
            if (!mutex.lock) {
                mutex.lock = true;
                resolve();
            } else {
                mutex.queue.push(tryAcquire);
            }
        };
        tryAcquire();
    });
};

// Function to release the mutex lock
const releaseLock = () => {
    mutex.lock = false;
    if (mutex.queue.length > 0) {
        const next = mutex.queue.shift();
        next();
    }
};

// Function to handle adding a view
const addviewd = async (req, res) => {
    const { id, pid } = req.params;

    try {
        // Acquire the lock before proceeding
        await acquireLock();
        

        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            releaseLock(); // Release the lock
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the video exists
        const video = await Video.findById(pid);
        if (!video) {
            releaseLock(); // Release the lock
            return res.status(404).json({ message: "Video not found" });
        }

        // Check if the user has already viewed the video
        if (user.watched.includes(pid)) {
            releaseLock(); // Release the lock
            return res.status(200).json({ message: "Video already viewed by the user" });
        }

        // Add the video ID to the viewed videos array
        user.watched.push(pid);
        await user.save(); // Await user save

        // Increment the view count of the video
        const updatedVideo = await Video.findByIdAndUpdate(
            pid,
            { $inc: { views: 1 } },
            { new: true } // Return the updated document
        );

        // Release the lock after completing the request
        releaseLock();

        res.status(200).json({ message: "View count updated successfully", updatedVideo });
    } catch (error) {
        console.error("Error updating view count:", error);
        releaseLock(); // Release the lock in case of error
        res.status(500).json({ message: "Error updating view count", error: error.message });
    }
};
const likevideo = async (req, res) => {
    const { id, pid } = req.params;

    try {
        // Fetch the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the video exists
        const video = await Video.findById(pid);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Check if the user has already liked the video
        if (user.likedvideos.includes(pid)) {
            // Remove the video ID from the likedvideos array of the user
            const likedIndex = user.likedvideos.indexOf(pid);
            if (likedIndex !== -1) {
                user.likedvideos.splice(likedIndex, 1);
            }
            await user.save();

            // Decrement the likes count of the video
            await Video.findByIdAndUpdate(pid, { $inc: { likes: -1 } });

            return res.status(200).json({ message: "Video like removed successfully" });
        }

        // Check if the user has already unliked the video
        const unlikedIndex = user.unlikedvideos.indexOf(pid);
        if (unlikedIndex !== -1) {
            // Remove the video ID from the unlikedvideos array
            user.unlikedvideos.splice(unlikedIndex, 1);
            // Decrement the unlikes count of the video
            await Video.findByIdAndUpdate(pid, { $inc: { unlikes: -1 } });
        }

        // Add the video ID to the likedvideos array of the user
        user.likedvideos.push(pid);
        await user.save();

        // Increment the likes count of the video
        await Video.findByIdAndUpdate(
            pid,
            { $inc: { likes: 1 } },
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: "Video liked successfully" });
    } catch (error) {
        console.error("Error liking video:", error);
        res.status(500).json({ message: "Error liking video", error: error.message });
    }
};

const unlikevideo = async (req, res) => {
    const { id, pid } = req.params;

    try {
        // Fetch the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the video exists
        const video = await Video.findById(pid);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Check if the user has already unliked the video
        const alreadyUnliked = user.unlikedvideos.includes(pid);
        if (alreadyUnliked) {
            // Remove the video ID from the unlikedvideos array of the user
            const unlikedIndex = user.unlikedvideos.indexOf(pid);
            if (unlikedIndex !== -1) {
                user.unlikedvideos.splice(unlikedIndex, 1);
                await user.save();

                // Decrement the unlikes count of the video
                await Video.findByIdAndUpdate(pid, { $inc: { unlikes: -1 } });

                return res.status(200).json({ message: "Video unlike removed successfully" });
            }
        }

        // Check if the user has already liked the video
        const likedIndex = user.likedvideos.indexOf(pid);
        if (likedIndex !== -1) {
            // Remove the video ID from the likedvideos array
            user.likedvideos.splice(likedIndex, 1);
            // Decrement the likes count of the video
            await Video.findByIdAndUpdate(pid, { $inc: { likes: -1 } });
        }

        // Add the video ID to the unlikedvideos array of the user
        user.unlikedvideos.push(pid);
        await user.save();

        // Increment the unlikes count of the video
        await Video.findByIdAndUpdate(
            pid,
            { $inc: { unlikes: 1 } },
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: "Video unliked successfully" });
    } catch (error) {
        console.error("Error unliking video:", error);
        res.status(500).json({ message: "Error unliking video", error: error.message });
    }
};

// Get user watched videos
const getuserwatched = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Find the user by ID
        const user = await User.findById(id); // Using lean for performance

        if (!user) {
          
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the watched array is defined and is an array
        if (!Array.isArray(user.watched) || user.watched.length === 0) {
            return res.status(200).json([]); // Return an empty array if no watched videos
        }

        // Find the videos watched by the user
        const watchedVideos = await Video.find({ _id: { $in: user.watched } });
        console.log("Watched Videos:", watchedVideos);

        res.status(200).json(watchedVideos);
    } catch (error) {
        console.error("Error fetching watched videos:", error);
        res.status(500).json({ message: "Error fetching watched videos", error: error.message }); // Improved error message
    }
};


// Get liked videos by user
const getuserliked = async (req, res) => {
    const { id } = req.params;
   
    try {
        // Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the videos liked by the user
        const likedVideos = await Video.find({ _id: { $in: user.likedvideos } });

        res.status(200).json(likedVideos);
    } catch (error) {
        console.error("Error fetching liked videos:", error);
        res.status(500).json({ message: "Error fetching liked videos", error });
    }
};


// Get all comments by a user
const getusercomments = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all comments made by the user
        const userComments = await Comment.find({ userId: id });

        res.status(200).json(userComments);
    } catch (error) {
        console.error("Error fetching user comments:", error);
        res.status(500).json({ message: "Error fetching user comments", error });
    }
};

module.exports = {
    getUsers,
    getUserByID,
    updateUserByID,
    deleteUserByID,
    getUservideo,
    addUserVideo,
    getUserVideoByID,
    updateUserVideoByID,
    deleteUserVideoByID,
    getCommentfromVideoByID,
    updateCommentfromVideoByID,
    deleteCommentfromVideoByID,
    createCommentfromVideoByID,
    addlike,
    addunlike,
    addviewd,
    likevideo,
    unlikevideo,
    getuserwatched,
    getuserliked,
    getusercomments,
    logout
};
