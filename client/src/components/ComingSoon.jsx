import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../styles/ComingSoon.css';

const ComingSoon = () => {
    const [comingsoon, setComingsoon] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/comingsoon")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setComingsoon(data);
            })
            .catch((error) => console.error("Error fetching movies", error));
    }, []);

    return (
        <div className="coming-soon-container">
            <h2>Coming Soon</h2>
            <div className="card-container">
                {comingsoon.map((movie) => (
                    <div key={movie.id} className="card movie-item">
                        <Link to={`/movie/commingsoon/${movie.id}`} className="link-no-underline">
                            <img src={movie.image} alt={movie.name} style={{ height: "300px", width: "100%" }} />
                            <div className="card-body">
                                <p className="card-text" style={{ textDecoration: 'none' }}>{movie.name}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div >

    );
};

export default ComingSoon;