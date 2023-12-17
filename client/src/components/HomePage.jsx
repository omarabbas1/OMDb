import React, { useState, useEffect } from "react";
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/HomePage.css';
import RecentMovies from './RecentMovies';
import FeaturedMovies from './FeaturedMovies';
import ComingSoon from './ComingSoon';


const HomePage = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchTopMovies = async () => {
            try {
                const response = await fetch("http://localhost:5000/recentmovies");
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error("Error fetching movies", error);
            }
        };
        fetchTopMovies();
    }, []);

    return (
        <div className="home-page" >
            <RecentMovies />
            <FeaturedMovies />
            <ComingSoon />
        </div>
    );
};

export default HomePage;