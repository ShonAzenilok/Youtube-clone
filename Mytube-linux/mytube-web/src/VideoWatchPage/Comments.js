import React, { useState, useEffect, useContext } from 'react';
import Comment from './Comment';
import style from './css/Comments.module.css';
import { ThemeContext } from '../App'; // Import the ThemeContext

function Comments({ videos, loggedUser, currentVideo, setVideo, fetchVideo, fetchComments, comments }) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext

    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState(''); // State for error message

    useEffect(() => {
        fetchComments();
    }, [currentVideo]);

    const handleAddComment = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${currentVideo._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment: commentText
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to add comment');
            }

            // Clear the comment input field after successfully adding comment
            setCommentText('');
            fetchVideo();
            setError(''); // Clear any previous error message
        } catch (error) {
            console.error('Error adding comment:', error);
            setError(error.message); // Set error message
        }
    };

    return (
        <div className={`d-flex flex-column mb-3 text-start h-100 w-100 ${theme === 'dark' ? style.dark : ''}`}>
            <h5 className={style.h5}>{currentVideo.commentamount} Comments</h5>
            {error && <div className={`alert alert-danger`} role="alert">{error}</div>} {/* Display  message */}
            <div className="input-group mb-3">
                <input
                    type="text"
                    className={`form-control ${style.input} ${theme === 'dark' ? style.dark : ''}`}
                    placeholder="Add a Comment"
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                    onClick={handleAddComment}
                    className={`btn btn-outline-secondary ${style.btn} ${theme === 'dark' ? style.dark : ''}`}
                    type="button"
                    id="button-addon2"
                >
                    Comment
                </button>
            </div>
            {comments.map((comment) => (
                <Comment
                    key={comment._id}
                    fetchVideo={fetchVideo}
                    loggedUser={loggedUser}
                    currentVideo={currentVideo}
                    id={comment._id}
                    userPublicName={comment.userPublicName}
                    comment={comment.comment}
                    likes={comment.liked}
                    unlikes={comment.unliked}
                    fetchComments={fetchComments}
                />
            ))}
        </div>
    );
}

export default Comments;
