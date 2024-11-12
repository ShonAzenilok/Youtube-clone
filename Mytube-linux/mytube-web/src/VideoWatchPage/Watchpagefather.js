import { useState, useContext, useEffect } from 'react'; // Import useState and useContext hooks
import Watchpage from "./Watchpage"
import LeftMenu from "../mainVideoPage/LeftMenu/LeftMenu"
import NavBar from "../mainVideoPage/NavBar/NavBar"
import { useParams } from "react-router-dom"
import { ThemeContext } from '../App'; // Import the ThemeContext
import style from './css/Watchpagefather.module.css'

function Watchpagefather({video,setVideo,loggedUser}) {
    const { identifier } = useParams();
    const { theme } = useContext(ThemeContext); // Consume the ThemeContext


    // Handle click on serach bar
    const handleSubmit = async (title) => {
        try {
            let response;
            if (title) {
                response = await fetch('http://localhost:8000/api/videos/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title })
                });
            } else {
                response = await fetch('http://localhost:8000/api/videos');
            }

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const filtered = await response.json();
            setVideo(filtered);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }
        

    return (
        <>
            <header><NavBar handleSubmit={handleSubmit} loggedUser={loggedUser}/></header>
            <div className={`container-fluid  ${theme === 'dark' ? style.dark : ''}`}> {/* Conditionally apply dark mode */}
                <div className="row">
                    <div className={`col-2 ${style.leftMenuContainer} `}>
                        <LeftMenu />
                    </div>
                    <div className={`col-10 ${style.RightMenuContainer} `}>
                        <Watchpage identifier={identifier} loggedUser={loggedUser} video={video} setVideo={setVideo} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Watchpagefather;
