import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import style from './css/Recvid.module.css';
import { ThemeContext } from '../App'; // Import the ThemeContext

function Recvid({ id, title, img, views, uploadDate, Setvideoid }) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext

    const updatedvidid = (id) => {
        Setvideoid(id);
    };

    return (
        <div className={`${style.recvidCard} ${theme === 'dark' ? style.dark : ''}`} onClick={() => updatedvidid(id)}>
            <div className={`row ${style.row}`}>
                <div className={`col-md-8`}>
                    <img src={`http://localhost:8000/${img}`} className={`${style.thumbnail} img `} alt="thumbnail" />
                </div>
                <div className={`col-md-4`}>
                    <div className={`${style.cardBody}`}>
                        <h6 className={`${style.title}`}>{title}</h6>
                        <p className={`card-text`}>
                            <small className={`${style.info}`}>
                                <span className={`${style.infoItem}`}>{views} Views</span>
                                <br />
                                <span className={`${style.infoItem}`}>Uploaded: {uploadDate}</span>
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recvid;
