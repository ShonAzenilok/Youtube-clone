import style from './css/Rightbar.module.css';
import Recvid from './Recvid';
import { Link } from 'react-router-dom';

function Rightbar({ videos, Setvideoid, currentVideo, recvids }) {
    // Filter out the current video from the videos array
    const filteredVideos = recvids.filter(video => video._id !== currentVideo._id);

    return (
        <div>
            <h3 className={style.h3}>
                For You
            </h3>
            {filteredVideos.map((video) => (
                <Link key={video._id} to={`/watch/${video._id}`} style={{ textDecoration: 'none' }}>
                    <Recvid
                        id={video._id}
                        title={video.title}
                        img={video.thumbnailPath}
                        views={video.views}
                        uploadDate={new Date(video.postdate).toLocaleDateString()} 
                        Setvideoid={() => Setvideoid(video._id)}
                    />
                </Link>
            ))}
        </div>
    );
}

export default Rightbar;
