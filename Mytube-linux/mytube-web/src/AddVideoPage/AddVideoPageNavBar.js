import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useState , useEffect } from 'react';
import style from './css/AddVideoPageNavBar.module.css';
import AddVideoModal from './AddVideoModal';
import { ThemeContext } from '../App';
import { useContext} from 'react';

function AddVideoPageNavBar({ addVideo, handleSearch, video,loggedUser, fetchVideosbylogged }) {
  const { theme, toggleTheme } = useContext(ThemeContext); // Consume the ThemeContext
  const [query, setQuery] = useState('');
  const [logo , setLogo] = useState ('http://localhost:8000/icons/yt-studio-light.svg');

  useEffect(() => {
      // Update logo path based on the theme
      const newLogo = theme === 'dark' ? 'http://localhost:8000/icons/yt-studio-dark.svg' : 'http://localhost:8000/icons/yt-studio-light.svg';
      setLogo(newLogo);
  }, [theme]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <nav className={`${style.navbar}  ${theme === 'dark' ? style.dark : ''}`}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to='/'>
          <img className={style.img}
            src={logo}
            alt="Logo"
          />
        </Link>
        <form className={`${style.form} ${theme === 'dark' ? style.dark : ''}`} role="search" onSubmit={handleSubmit}>
          <input
            className={`form-control me-2 ${style.forminput} ${theme === 'dark' ? style.dark : ''}`}
            type="search"
            value={query}
            placeholder="Search videos"
            aria-label="Search"
            onChange={handleChange}
          />
          <button className={`${style.btnsearch} ${theme === 'dark' ? style.dark : ''}`} type="submit">
            Search
          </button>
          
        </form>
        <AddVideoModal addVideo={addVideo} loggedUser={loggedUser} fetchVideosbylogged={fetchVideosbylogged} />
      </div>
      <Link to='/login'><img className={style.pfpbutton} src={`http://localhost:8000/${loggedUser.profilePicPath}`} alt="pfp"  /></Link>
    </nav>
  );
}

export default AddVideoPageNavBar;
