import Rightbar from './Rightbar';
import Mainvideo from './Mainvideo';
import React, { useState, useEffect, useContext } from 'react';
import style from './css/VideoWatchPage.module.css';
import { ThemeContext } from '../App'; // Import the ThemeContext

function Watchpage({ identifier, loggedUser, video, setVideo }) {
    const [videoId, setVideoId] = useState(identifier);
    const [recvids, setRecvids] = useState([{}])
    const [currentVideo, setCurrentVideo] = useState([{}])
    const [comments, setComments] = useState([]);
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext



    const incrementViews = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${identifier}/viewed`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

        } catch (error) {
            console.error('Error incrementing video views:', error);
        }
    };

    // Define fetchComments function
    const fetchComments = async () => {
        if (currentVideo._id) {
            try {
                const response = await fetch(`http://localhost:8000/api/videos/${currentVideo._id}/comments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const com = await response.json();
                setComments(com);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
    };
    const fetchVideo = async () => {
        if (identifier) {
            try {
                const response = await fetch(`http://localhost:8000/api/videos/${identifier}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch video');
                }
                const videoData = await response.json();
                setCurrentVideo(videoData);
                incrementViews();

            } catch (error) {
                console.error('Error fetching video:', error);
            }
        }
    };

    const fetchRec = async () => {
        if (video) {
            try { 
                const response = await fetch('http://localhost:8000/api/videos/', {
                    method: 'POST',  // Change the method to POST
                    headers: {
                        'Content-Type': 'application/json'  // Specify that the request body contains JSON
                    },
                    body: JSON.stringify({ id: loggedUser ,watchedvideo: videoId })  // Pass the `video` data in the body
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch video');
                }
    
                const recvids = await response.json();
                setRecvids(recvids);  // Update the state with the recommended videos
    
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        }
    };
    



    useEffect(() => {


        fetchVideo();
        fetchRec();
        fetchComments();
    }, []);


    useEffect(() => {


        fetchVideo();
        fetchComments();
    }, [videoId]); // Dependency array should include videoId



    const setVideoIdAndUpdate = (id) => {
        setVideoId(id);
    };

    return (
        <div className={`container-fluid ${theme === 'dark' ? style.dark : ''}`}>
            <div className="row">
                <div className={`col-8 ${style.leftMenuContainer}`}>
                    <Mainvideo
                        video={currentVideo}
                        loggedUser={loggedUser}
                        currentVideo={currentVideo}
                        setVideo={setVideo}
                        fetchVideo={fetchVideo}
                        fetchComments={fetchComments}
                        comments={comments}

                    />
                </div>
                <div className={`col-4 ${style.leftMenuContainer}`}>
                    <Rightbar videos={video} Setvideoid={setVideoIdAndUpdate} currentVideo={currentVideo} recvids={recvids} />
                </div>
            </div>
        </div>
    );
}

export default Watchpage;
