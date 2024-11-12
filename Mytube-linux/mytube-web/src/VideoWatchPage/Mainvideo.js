import React, { useContext } from 'react';
import Bar from './Bar';
import Comments from './Comments';
import style from './css/Mainvideo.module.css';
import { ThemeContext } from '../App'; // Import the ThemeContext

function Mainvideo({ video, loggedUser, currentVideo, setVideo, fetchVideo, fetchComments,comments }) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext
    return (
        <>
            <video className={`${style.video} ${theme === 'dark' ? style.dark : ''}`} src={`http://localhost:8000/${video.videoPath}`} controls style={{ marginTop: '15px' }}></video>
            <div className={`container-fluid ${style.barcom} ${theme === 'dark' ? style.dark : ''}`}>
                <Bar
                    title={video.title}
                    description={video.description}
                    views={video.views}
                    postdate={video.postdate}
                    videos={video}
                    loggedUser={loggedUser}
                    setVideo={setVideo}
                    currentVideo={currentVideo}
                    fetchVideo={fetchVideo}
                />
            </div>
            <div className={`container-fluid ${style.commentcom} ${theme === 'dark' ? style.dark : ''}`}>
                <Comments
                    videos={video}
                    loggedUser={loggedUser}
                    currentVideo={currentVideo}
                    setVideo={setVideo}
                    fetchVideo={fetchVideo}
                    fetchComments={fetchComments}
                    comments={comments}
                />
            </div>
        </>
    );
}

export default Mainvideo;
