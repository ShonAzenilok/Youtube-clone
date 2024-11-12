import React, { useState, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import style from "./css/AddVideoModal.module.css";
import { ThemeContext } from '../App';

function AddVideoModal({ addVideo, loggedUser, fetchVideosbylogged }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploadImage, setThumbnailPath] = useState(null);
    const [uploadVideo, setVideoPath] = useState(null);
    const [show, setShow] = useState(false);
    const [error, setError] = useState(''); // State variable for error message

    const { theme } = useContext(ThemeContext); // Consume the ThemeContext

    const handleClose = () => {
        setShow(false);
        setError(''); // Clear error message on close
    };
    const handleShow = () => setShow(true);

    const handleUpload = async () => {
        // Create a FormData object to store the video data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (uploadImage) formData.append('uploadImage', uploadImage);
        if (uploadVideo) formData.append('uploadVideo', uploadVideo);

        try {
            // Make a POST request to your server endpoint
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Video uploaded:', data);
            fetchVideosbylogged();

            // Clear input fields after upload
            setTitle('');
            setThumbnailPath(null);
            setVideoPath(null);
            setDescription('');
            setShow(false);
        } catch (error) {
            console.error('Error uploading video:', error);
            setError('Error uploading video: ' + error); // Set error message
        }
    };

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    return (
        <>
            <button className={`${style.btnadd} ${theme === 'dark' ? style.dark : ''}`} onClick={handleShow}>
                Add Video
            </button>

            <Modal show={show} onHide={handleClose} className={style.modaldialog} backdrop="static">
                <Modal.Header closeButton style={{ backgroundColor: theme === 'dark' ? '#212529' : 'crimson' }}>
                    <Modal.Title style={{ fontWeight: 'bold', color: 'white' }}>Add video</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: theme === 'dark' ? '#343a40' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
                    {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
                    <div className="mb-3">
                        <span className={style.input_group_text}>Video Title</span>
                        <textarea className="form-control" aria-label="With textarea" rows="1" value={title} onChange={(e) => setTitle(e.target.value)}></textarea>
                    </div>
                    <div className="mb-3">
                        <span className={style.input_group_text}>Add description</span>
                        <textarea className="form-control" aria-label="With textarea" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="row mb-3">
                        <div className="input-group">
                            <input
                                type="file"
                                className="form-control"
                                accept="video/*"
                                onChange={(e) => handleFileChange(e, setVideoPath)}
                            />
                            <label className="input-group-text" htmlFor="video-upload">Upload Video</label>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="input-group">
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, setThumbnailPath)}
                            />
                            <label className="input-group-text" htmlFor="thumbnail-upload">Upload Thumbnail</label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: theme === 'dark' ? '#343a40' : '#fff', borderTop: theme === 'dark' ? 'none' : '1px solid #dee2e6' }}>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleUpload}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddVideoModal;
