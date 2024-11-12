import { BsHouseFill, BsFillPersonFill } from 'react-icons/bs'; 
import { AiFillFire, AiFillHeart } from 'react-icons/ai'; 
import { RiHistoryFill } from 'react-icons/ri'; 
import style from './css/LeftMenu.module.css';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../App'; 
import { useContext } from 'react';

function LeftMenu({ handleMostWatched, handleWatched, handleLiked, handleHome}) {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext

    return (
        <div className={`col-md-2 py-3 ${style.leftMenu} ${theme === 'dark' ? style.dark : ''}`}>
            <ul className={`nav-item list-group ${style.mainButtons}`}>
                <li className={style.navItem} onClick={handleHome}>
                    <Link to="/" className={style.navLink}>
                        <BsHouseFill className={style.navIcon} />
                        Home
                    </Link>
                </li>
                <li className={style.navItem} onClick={handleMostWatched}>
                    <Link to="/" className={style.navLink}>
                        <AiFillFire className={style.navIcon} />
                        Most Viewed
                    </Link>
                </li>
                <li className={style.navItem} onClick={handleWatched}>
                    <Link to="/" className={style.navLink}>
                        <RiHistoryFill className={style.navIcon} />
                        Watched
                    </Link>
                </li>
                <li className={style.navItem} onClick={handleLiked}>
                    <Link to="/" className={style.navLink}>
                        <AiFillHeart className={style.navIcon} />
                        Liked Videos
                    </Link>
                </li>
            </ul>
            <ul className={`nav-item list-group ${style.secondaryButtons}`}>
                <li className={style.navItem}>
                    <Link to="/add" className={style.navLink}>
                        <BsFillPersonFill className={style.navIcon} />
                        Profile
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default LeftMenu;
