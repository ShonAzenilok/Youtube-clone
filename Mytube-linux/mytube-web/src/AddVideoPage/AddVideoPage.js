import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import style from './css/AddVideoPage.module.css';
import AddVideoPageNavBar from './AddVideoPageNavBar';
import AddVideoPageSideBar from './AddVideoPageSideBar';
import AddVideoPageMain from './AddVideoPageMain';
import { ThemeContext } from '../App';

function AddVideoPage({ setVideo, loggedUser,fetchlogged }) {
    const [videosbyuser, setvideosbyuser] = useState([{}]);
    const [fatherState, setFatherState] = useState(false);
    const [childStates, setChildStates] = useState(Array(videosbyuser.length).fill(false));
    const { theme } = useContext(ThemeContext);
    const Sorted = useRef(false);

    // Function to sort array by ABC
    const handlesort = useCallback(() => {
        const sortedVideos = [...videosbyuser].sort((a, b) =>
            Sorted.current ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
        );
        setvideosbyuser(sortedVideos);
        Sorted.current = !Sorted.current;
    }, [videosbyuser, setVideo]);

    const fetchVideosbylogged = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos`);
            const videos = await response.json();
            setvideosbyuser(videos);
        } catch (error) {
            console.log("Error fetching videos:", error);
        }
    };

    useEffect(() => {
        if (loggedUser) {
          fetchlogged()
          fetchVideosbylogged()
        }
    }, [])


    useEffect(() => {
        setChildStates(Array(videosbyuser.length).fill(false));
    }, [videosbyuser.length]);

    const handleOnClickFather = useCallback(() => {
        const newState = !fatherState;
        setFatherState(newState);
        setChildStates(Array(childStates.length).fill(newState));
    }, [fatherState, childStates.length]);

    const handleOnClickChild = useCallback((index) => {
        const newChildStates = [...childStates];
        newChildStates[index] = !newChildStates[index];
        setChildStates(newChildStates);
        setFatherState(newChildStates.every(state => state));
    }, [childStates]);

    const handleDelete = useCallback(async () => {
        try {
            const idsToDelete = videosbyuser.filter((_, index) => childStates[index]).map(v => v._id);

            await Promise.all(idsToDelete.map(async (id) => {
                const response = await fetch(`http://localhost:8000/api/users/${loggedUser._id}/videos/${id}`, {
                
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete videos');
                }
            }));

            const newVideo = videosbyuser.filter((_, index) => !childStates[index]);
            setvideosbyuser(newVideo);
        } catch (error) {
            console.error('Error deleting videos:', error);
        }
    }, [videosbyuser, childStates, loggedUser._id, setVideo]);

    const handleSearch = useCallback(async (title) => {
        try {
            const response = await fetch('http://localhost:8000/api/videos/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const filtered = await response.json();
            setvideosbyuser(filtered);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }, [setVideo]);

    return (
        <div className={`${theme === 'dark' ? style.dark : ''}`}>
            <AddVideoPageNavBar handleSearch={handleSearch} loggedUser={loggedUser}  fetchVideosbylogged={fetchVideosbylogged}/>
            <div className="container-fluid text-start">
                <div className="row d-flex-inline">
                    <div className="col-2">
                        <AddVideoPageSideBar />
                    </div>
                    <div id="main_content" className={`col-10 ${style.rightcol}`}>
                        <AddVideoPageMain
                            videol={videosbyuser}
                            handleDelete={handleDelete}
                            fatherState={fatherState}
                            childStates={childStates}
                            handleOnClickFather={handleOnClickFather}
                            handleOnClickChild={handleOnClickChild}
                            handlesort={handlesort}
                           
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

AddVideoPage.propTypes = {
    setVideo: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired
};

export default AddVideoPage;
