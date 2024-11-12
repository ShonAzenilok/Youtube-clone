import style from './css/comment.module.css';
import { ThemeContext } from '../App'; // Import the ThemeContext
import { useContext, useState } from 'react';

function Comment({ id, userPublicName, comment, likes, unlikes, fetchVideo, loggedUser, currentVideo }) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext
    const [isEditing, setIsEditing] = useState(false); // State to handle edit mode
    const [newComment, setNewComment] = useState(comment); // State to store updated comment text
    const [editError, setEditError] = useState(null); // State for error handling during editing

    // Function to handle like click
    const handleLikeClick = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${currentVideo._id}/comments/${id}/like`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to like comment');
            }

            fetchVideo(); // Refresh comments to get the latest counts
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    // Function to handle unlike click
    const handleUnlikeClick = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${currentVideo._id}/comments/${id}/unlike`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to unlike comment');
            }

            fetchVideo(); // Refresh comments to get the latest counts
        } catch (error) {
            console.error('Error unliking comment:', error);
        }
    };

    // Function to handle comment delete
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${currentVideo._id}/comments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
    
            fetchVideo(); // Refresh the video to reflect the deletion
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Function to handle edit button click
    const handleEdit = () => {
        setIsEditing(true); // Enable edit mode
    };

    // Function to handle input change in edit mode
    const handleInputChange = (e) => {
        setNewComment(e.target.value); // Update new comment state
    };

    // Function to handle saving the edited comment
    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${currentVideo._id}/comments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment: newComment, // Send updated comment
                }),
            });

            if (!response.ok) {
                console.log(response.message)
                throw new Error('Failed to update comment:'+ response.message);
            }

            fetchVideo(); // Refresh video to get updated comments
            setIsEditing(false); // Exit edit mode
            setEditError(null); // Clear any previous error
        } catch (error) {
            setEditError(error.message); // Display error if any
            console.error('Error updating comment:', error);
        }
    };

    return (
        <div className={`${style.container} ${theme === 'dark' ? style.dark : ''}`}>
            <h6 className={`${style.h6} ${theme === 'dark' ? style.dark : ''}`}>{userPublicName}</h6>

            {loggedUser.publicName === userPublicName && ( // Show delete button only for the comment owner
                <button className={`btn btn-outline-secondary ${style.Buttonx}`} type="button" onClick={handleDelete}></button>
            )}
            {loggedUser.publicName === userPublicName && ( // Show edit button only for the comment owner
                <button className={`btn btn-outline-secondary ${style.Buttone}`} type="button" onClick={handleEdit}></button>
            )}

            {/* Conditionally render comment or input field based on edit mode */}
            {isEditing ? (
                <div>
                    <input 
                        type="text" 
                        value={newComment} 
                        onChange={handleInputChange} 
                        className={style.input} 
                    />
                    <button onClick={handleSave} className="btn btn-success">Save</button>
                    {editError && <p className={style.error}>{editError}</p>} {/* Display error message */}
                </div>
            ) : (
                <p className={`${style.p} ${theme === 'dark' ? style.dark : ''}`}>{comment}</p>
            )}

            <div className={style.buttonscontainer}>
                <button className={`btn btn-outline-danger ${style.Button}`} type="button" onClick={handleLikeClick}>
                    Likes <span className={style.counter}>{likes}</span>
                </button>
                <button className={`btn btn-outline-danger ${style.Button}`} type="button" onClick={handleUnlikeClick}>
                    Unlikes <span className={style.counter}> {unlikes}</span>
                </button>
            </div>
        </div>
    );
}

export default Comment;
