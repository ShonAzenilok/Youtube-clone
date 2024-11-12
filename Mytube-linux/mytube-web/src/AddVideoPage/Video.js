import style from './css/Video.module.css';
import React, { useContext } from 'react';
import { ThemeContext } from '../App';

function Video({ state, click, video }) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext

    return (
        <div id="videos-row" className={`row ${theme === 'dark' ? style.dark : ''}`}>
            <div className={`col ${style.column}`}>
                <input type="checkbox" id="checkbox1" name="checkbox1" checked={state} onChange={click} />
            </div>
            <div className={`col ${style.column}`}>
                <img className={style.vidimg}
                    src={`http://localhost:8000/${video.thumbnailPath}`}
                    alt="video thumbnail"
                />
            </div>
            <div className={`col ${style.column}`}>{video.title}</div>
            <div className={`col ${style.column}`}>{new Date(video.postdate).toLocaleDateString()}</div>
            <div className={`col ${style.column}`}>{video.views}</div>
            <div className={`col ${style.column}`}>{video.commentamount}</div>
            <div className={`col ${style.column}`}>{video.likes - video.unlikes}</div>
        </div>
    );
}

export default Video;
