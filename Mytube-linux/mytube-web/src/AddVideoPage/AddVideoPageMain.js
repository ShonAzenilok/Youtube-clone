import React from 'react';
import Video from './Video';
import style from './css/AddVideoPageMain.module.css';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { ThemeContext } from '../App';
import { useState, useContext, useEffect } from 'react';
function AddVideoPageMain({ videol, handleDelete, fatherState, childStates, handleOnClickFather, handleOnClickChild,handlesort,fetchVideosbylogged }) {
    const { theme, toggleTheme } = useContext(ThemeContext); // Consume the ThemeContext
    return (
        <div className={`${style.container} ${theme === 'dark' ? style.dark : ''}`}>
            <div className={`row ${style.header}`}>
                <div className={style.col}>
                    <h4>Main Content</h4>
                </div>
            </div>
            <div className={`row ${style.subheader}`}>
                <div className={style.col}>
                    Videos
                </div>
            </div>
            <div className={`row ${style.filterRow}`}>
                <div className={`col ${style.colfilter}`}>
                    <button className={style.imgbutton} onClick={() =>handlesort()}><img src={"http://localhost:8000/icons/filter.svg"} alt="Filter icon" className={style.filterIcon} /></button>
                </div>
                <div className={`col ${style.coldelete}`}>
                    <button type="button" className={style.delbutton} onClick={() => handleDelete(childStates, videol)}>Delete selected</button>
                </div>
            </div>
            <div className={`row ${style.parametersRow}`}>
                <div className={`col ${style.column}`}>
                    <input type="checkbox" id="checkbox-0" name="checkbox1" checked={fatherState} onChange={handleOnClickFather} />
                </div>
                <div className={`col ${style.column}`}>Video</div>
                <div className={`col ${style.column}`}>Name</div>
                <div className={`col ${style.column}`}>Date</div>
                <div className={`col ${style.column}`}>Views</div>
                <div className={`col ${style.column}`}>Comments</div>
                <div className={`col ${style.column}`}>Likes vs Dislikes</div>
            </div>
            {videol.map((video, index) => (
                <Video key={index} state={childStates[index]} click={() => handleOnClickChild(index)} video={video} />
            ))}
        </div>
    );
}

export default AddVideoPageMain;
