import React, { useContext, useEffect, useState } from 'react';
import styles from './css/Buttons.module.css';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../App'; // Import the ThemeContext

function Buttons({ videos, loggedUser, currentVideo, fetchVideo }) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext
    const [uploaderPfp, setUploaderPfp] = useState('');

    useEffect(() => {
        if (videos.uploaderID) { // Check if uploaderID exists
            const fetchUploaderData = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/users/${videos.uploaderID}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch uploader data');
                    }
                    const uploader = await response.json();
                    setUploaderPfp(`http://localhost:8000/${uploader.profilePicPath}`);
                } catch (error) {
                    console.error('Error fetching uploader data:', error);
                }
            };

            fetchUploaderData();
        }
    }, [videos]);

    const handleLikeClick = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${currentVideo._id}/like`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to like video');
            }

            fetchVideo(); // Refresh comments to get the latest counts
        } catch (error) {
            console.error('Error liking video:', error);
        }
    };

    const handleUnlikeClick = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${currentVideo._id}/unlike`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to unlike video');
            }

            fetchVideo(); // Refresh comments to get the latest counts
        } catch (error) {
            console.error('Error unliking video:', error);
        }
    };

    const handleShare = () => {
        const currentUrl = window.location.href;
        // Display the current URL in a prompt dialog
        window.prompt('Share this Video:', currentUrl);
        
    };

    return (
        <div className={`${styles.flexContainer} ${theme === 'dark' ? styles.dark : ''}`}>
            <img src={uploaderPfp} alt="Uploader Icon" className={styles.pfpimg} />
            <button className={`${styles.likeButton}`} type="button" onClick={handleLikeClick}>
                Like <span className={styles.counter}>{videos.likes}</span>
            </button>
            <button className={`${styles.unlikeButton}`} type="button" onClick={handleUnlikeClick}>
                Unlike <span className={styles.counter}>{videos.unlikes}</span>
            </button>
            <button className={`${styles.shareButton}`} type="button" onClick={handleShare}>
                Share
            </button>
        </div>
    );
}

export default Buttons;
