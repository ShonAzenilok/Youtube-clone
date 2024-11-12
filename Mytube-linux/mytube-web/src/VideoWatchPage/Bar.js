import React, { useContext } from 'react';
import Buttons from './Buttons';
import styles from './css/Bar.module.css'; // Import CSS module
import { ThemeContext } from '../App'; // Import the ThemeContext

function Bar({ title, description, views, postdate, videos, loggedUser,currentVideo,fetchVideo}) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext

    return (
        <div className={`${styles.barContainer} ${theme === 'dark' ? styles.dark : ''}`}>
            <h4 className={`${styles.barTitle}`}>{title}</h4>
            <Buttons videos={videos}  loggedUser={loggedUser} currentVideo={currentVideo} fetchVideo={fetchVideo}/>
            <div className={`${styles.desc}`}>
                <p className={`${styles.barViewsPostdate}`}>{views} Views • Uploaded at {new Date(postdate).toLocaleDateString()}</p>
                <p className={`${styles.barDescription}`}>{description}</p>
            </div>
        </div>
    );
}

export default Bar;
