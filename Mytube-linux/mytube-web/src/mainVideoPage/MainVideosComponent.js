import { useState, useContext, useEffect } from 'react';
import style from './MainVideosComponent.module.css';
import VideoItem from './VideoItem';
import { Link } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import LeftMenu from './LeftMenu/LeftMenu';
import { ThemeContext } from '../App'; // Import the ThemeContext

function MainVideosComponent({ video, setVideo, loggedUser }) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext
 



    // Handle click on submit bar
    const handleSubmit = async (title) => {
        try {
            let response;
            if (title) {
                response = await fetch('http://localhost:8000/api/videos/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title })
                });
            } else {
                response = await fetch('http://localhost:8000/api/videos');
            }

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const filtered = await response.json();
            setVideo(filtered);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }

    // Handle "Most Watched" button click
    const handleMostWatched = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/videos/mostwatched');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const mostWatched = await response.json();
            setVideo(mostWatched);
        } catch (error) {
            console.error('Error fetching most watched videos:', error);
        }
    };

    // Handle "Watched" button click
    const handleWatched = async () => {
       
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videowatch`);
            console.log("clicked")
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.messege);
            }
            const watched = await response.json();
            setVideo(watched);
        } catch (error) {
            console.error('Error fetching watched videos:', error);
        }
    };

    // Handle "Liked" button click
    const handleLiked = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videoliked`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const liked = await response.json();
            console.log(liked)
            setVideo(liked);
        } catch (error) {
            console.error('Error fetching liked videos:', error);
        }
    };
    // Handle "home" button click
    const handleHome = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/videos');
            const videos = await response.json();
            setVideo(videos);
          } catch (error) {
            console.log("Error fetching videos:", error);
          }
    };

    return (
        <div className={`youtube-page ${theme === 'dark' ? style.dark : ''}`}>
            <header>
                <NavBar handleSubmit={handleSubmit} loggedUser={loggedUser} />
            </header>
            <div className="container-fluid">
                <div className="row">
                    <div className={`col-2 ${style.leftMenuContainer}`}>
                        <LeftMenu 
                            handleMostWatched={handleMostWatched} 
                            handleWatched={handleWatched} 
                            handleLiked={handleLiked} 
                            handleHome = {handleHome}
                        />
                    </div>
                    <div className={`col-10 ${style.mainContent}`}>
                        <br />
                        <div className={`row ${style.videos}`}>
                            {video.map((video, key) => (
                                <div className="col" key={key}>
                                    <Link to={`/watch/${video._id}`} className={style.videoLink} style={{
                                        textDecoration: 'none',
                                        maxWidth: '290px',
                                        maxHeight: '260px'
                                    }} >
                                        <VideoItem {...video} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainVideosComponent;
