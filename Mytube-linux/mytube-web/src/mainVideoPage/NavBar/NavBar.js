import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import styles from './css/NavBar.module.css';
import Switch from 'react-switch';
import { ThemeContext } from '../../App';

function NavBar({ handleSubmit, loggedUser }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [logo, setLogo] = useState('http://localhost:8000/icons/youtube-light.png');
    const [pfp, setPfp] = useState("http://localhost:8000/default-profile.png"); // Default profile pic

    useEffect(() => {
        // Update logo path based on the theme
        setLogo(theme === 'dark' ? 'http://localhost:8000/icons/youtube-dark.png' : 'http://localhost:8000/icons/youtube-light.png');
    }, [theme]);

    useEffect(() => {
        // Update pfp when loggedUser changes
        if (loggedUser.profilePicPath) {
            setPfp(`http://localhost:8000/${loggedUser.profilePicPath}`);
        } else {
            setPfp('http://localhost:8000/default-profile.png'); // Fallback if no profile pic
        }
    }, [loggedUser]);

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(query);
        navigate('/');
    };

    return (
        <nav className={`navbar ${styles.navbar} ${theme === 'dark' ? styles.dark : ''}`}>
            <Link to='/'>
                <img className={styles.imgyt} src={logo} alt="YouTube" />
            </Link>

            <form className={`d-flex ${styles.searchForm}`} role="search" onSubmit={onSubmit}>
                <input
                    className={`form-control me-2 ${styles.searchInput} ${theme === 'dark' ? styles.dark : ''}`}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos"
                    aria-label="Search"
                />
                <button className={`${styles.btnsearch} ${theme === 'dark' ? styles.dark : ''}`} type="submit">
                    Search
                </button>
            </form>

            <div className={styles.btnContainer}>
                <Switch
                    onChange={toggleTheme}
                    checked={theme === "dark"}
                    offColor="#888"
                    onColor="#000"
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
                <Link
                    to={loggedUser._id === '000000000000000000000000' ? '/login' : '/add'}
                    style={{ textDecoration: 'none' }}>
                    <button className={`${styles.btnsearchone} ${theme === 'dark' ? styles.dark : ''}`}>
                        {loggedUser._id === '000000000000000000000000'
                            ? "Login"
                            : `Logged as ${loggedUser.publicName}`}
                    </button>
                </Link>
                <Link to='/login'>
                    <img className={styles.pfpbutton} src={pfp} alt="Profile" />
                </Link>
            </div>
        </nav>
    );
}

export default NavBar;
