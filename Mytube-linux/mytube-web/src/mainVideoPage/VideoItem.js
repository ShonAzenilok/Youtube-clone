import { useEffect, useState, useContext } from 'react'; // Import useEffect, useState, and useContext hooks
import styles from './VideoItem.module.css'; // Import CSS module
import { ThemeContext } from '../App'; // Import the ThemeContext

function VideoItem(video) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext
    const [uploaderName, setUploaderName] = useState(''); // State to hold uploader's public name

    useEffect(() => {
        const fetchUploaderName = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${video.uploaderID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch uploader name');
                }
                const user = await response.json();
                setUploaderName(user.publicName);
              
            } catch (error) {
                console.error('Error fetching uploader name:', error);
            }
        };

        fetchUploaderName();
    }, [video.uploaderId]);

    return (
        <div className={`${styles.cardBody} ${styles.border} ${styles.rounded} ${theme === 'dark' ? styles.dark : ''}`}>
            <img className={`${styles.cardImg}`} src={`http://localhost:8000/${video.thumbnailPath}`} alt={video.title} />
            <h5 className={`${styles.cardTitle}`}>{video.title}</h5>
            <p className={`${styles.cardText}`}>By:{uploaderName}</p>
            <div className={`d-flex justify-content-between align-items-center ${styles.metaInfo}`}>
                <small className={`${styles.textMuted}`}>{video.views} views</small>
                <small className={`${styles.textMuted}`}>Uploaded at {new Date(video.postdate).toLocaleDateString()}</small>
            </div>
        </div>
    )
}

export default VideoItem;
