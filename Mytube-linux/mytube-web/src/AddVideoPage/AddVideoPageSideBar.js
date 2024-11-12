import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import style from './css/AddVideoPageSideBar.module.css';
import { FaHome, FaFire, FaBell, FaHistory, FaFolderOpen, FaComments, FaUpload } from 'react-icons/fa';
import { ThemeContext } from '../App';

function AddVideoPageSideBar() {
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext

    return (
        <ul className={`${style.nav} ${theme === 'dark' ? style.dark : ''}`}>
            <li className={style.nav_item}>
                <Link to='/' className={style.nav_link}>
                    <FaHome className={`${style.nav_icon} ${theme === 'dark' ? style.dark_icon : ''}`} />
                    Home
                </Link>
            </li>
            <li className={style.nav_item}>
                <Link to='/add' className={style.nav_link}>
                    <FaUpload className={`${style.nav_icon} ${theme === 'dark' ? style.dark_icon : ''}`} />
                    Uploaded
                </Link>
            </li>
           
            
        </ul>
    );
}

export default AddVideoPageSideBar;
