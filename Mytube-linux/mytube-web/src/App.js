import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddVideoPage from './AddVideoPage/AddVideoPage';
import MainVideosComponent from './mainVideoPage/MainVideosComponent';
import Watchpagefather from './VideoWatchPage/Watchpagefather';
import Register from './Authentication/Components/Authorization/Register/Register';
import Login from './Authentication/Components/Authorization/Login/Login';
import { useState, useEffect, createContext } from 'react';
import Switch from "react-switch";

export const ThemeContext = createContext(null);

function App() {
  const [video, setVideo] = useState([{}]);
  const [userslist, setUserslist] = useState([{}]);
  const [theme, setTheme] = useState("light");
  const [loggedUser, setLoggedUser] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/videos');
      const videos = await response.json();
      setVideo(videos);
    } catch (error) {
      console.log("Error fetching videos:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      const users = await response.json();
      setUserslist(users);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const fetchlogged = async () => {
    const token = sessionStorage.getItem('token'); // No need to parse since it's a string
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const response = await fetch('http://localhost:8000/api/tokens', { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const logged = await response.json();
      setLoggedUser(logged);
    } catch (error) {
      console.log("Error fetching logged user:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchVideos();
      await fetchUsers();
      await fetchlogged();
      setLoading(false); // Set loading to false once all data is fetched
    };

    fetchData();
  }, []);

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  };

  if (loading) {
    return (
      <div className="App">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className='App' id={theme}>
        <Router>
          <Routes>
            <Route path='/' element={<MainVideosComponent video={video} setVideo={setVideo} loggedUser={loggedUser} />} />
            <Route exact path='/login' element={<Login userslist={userslist} setUserslist={setUserslist} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />} />
            <Route path='/register' element={<Register userslist={userslist} setUserslist={setUserslist} />} />
            <Route path='/watch/:identifier' element={<Watchpagefather video={video} setVideo={setVideo} loggedUser={loggedUser} />} />
            <Route path='/add' element={<AddVideoPage setVideo={setVideo} loggedUser={loggedUser} fetchlogged={fetchlogged} />} />
          </Routes>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
