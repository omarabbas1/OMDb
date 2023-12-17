import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../styles/FeaturedMovies.css';


const FeaturedMovies = () => {
    const [featuredmovies, setfeatured] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/featured")
            .then((response) => response.json())
            .then((data) => {
                setfeatured(data);
            })
            .catch((error) => console.error("Error fetching featured movies", error));
    }, []);

    return (
        <div className="featured-container">
            <h2>Featured Today</h2>
            <div className="card-container">
                {featuredmovies.map((movie) => (
                    <div key={movie.id} className="card">
                        <Link to={`/movie/${movie.id}`} className="link-no-underline">
                            <img className="card-img-top" src={movie.image} alt={movie.name} style={{ height: "380px", width: "100%" }} />
                            <div className="card-body">
                                <p className="card-text" style={{ textDecoration: 'none' }}>{movie.name}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedMovies;