import React from 'react';
// import Navbar from './Navbar';
import Title from './Title';
import UserDetails from './UserDetails';
import { Outlet, Route, Routes } from 'react-router-dom';
import Project from './Project';
import Board from './Board';

export default function Home() {
    return (
        <div className="homePage">
            <Title />
            <Routes>
                <Route path="/" element={<Project />} />
                <Route path="project" element={<Project />} />
                <Route path="userdetails" element={<UserDetails />} />
                <Route path="board/:id" element={<Board />} />
            </Routes>
        </div>
    );
}
