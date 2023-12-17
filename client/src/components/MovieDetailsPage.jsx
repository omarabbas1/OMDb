import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/MovieDetailsPage.css'; // Import the CSS file

const MovieDetailsPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState('');

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/movie/${id}`);
                if (response.ok) {
                    const movieData = await response.json();
                    setMovie(movieData);
                    // Fetch YouTube trailer
                    const trailerUrl = await fetchYouTubeTrailer(movieData.name);
                    setTrailerUrl(trailerUrl);
                } else {
                    console.error('Failed to fetch movie details');
                }
            } catch (error) {
                console.error('Error fetching movie details', error);
            }
        };
        fetchMovieDetails();
    }, []);

    const fetchYouTubeTrailer = async (movieName) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                    movieName + ' trailer'
                )}&type=video&key=AIzaSyCkhcZJxXgexsSa9NLRddWBQWm5PkUbI-4`
            );

            if (response.ok) {
                const data = await response.json();
                if (data.items.length > 0) {
                    const trailerId = data.items[0].id.videoId;
                    const trailerUrl = `https://www.youtube.com/embed/${trailerId}?autoplay=1&controls=0`;
                    return trailerUrl;
                }
            } else {
                console.error('Failed to fetch trailer');
            }
        } catch (error) {
            console.error('Error fetching trailer:', error);
        }
    };
    return (
        // <div className="content">
        //     {movie && (
        //         <div className="movie-details-container">
        //         <img src={movie.image} alt={movie.name} />
        //         <div className="movie-details-text">
        //             <h2>{movie.name}</h2>
        //             <p>Genre: {movie.genre}</p>
        //             <p>Director: {movie.director}</p>
        //             <p>Writer: {movie.writer}</p>
        //             <p>Rating: {movie.star}</p>
        //         </div>
        //         </div>
        //     )}
        // </div>
        <div className="content-moviedetail">
            {movie && (
                <div className="movie-details-container">
                    <div className="image">
                        <img src={movie.image} alt={movie.name} />
                    </div>

                    <div className='text'>
                        <h2>{movie.name}</h2>
                        <p>Genre: {movie.genre}</p>
                        <p>Director: {movie.director}</p>
                        <p>Writer: {movie.writer}</p>
                        <p>Rating: {movie.star}</p>
                        <div className='other-trailers'>
                            <button>
                                <Link
                                    to={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                        `${movie.name} trailer`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Other Trailers
                                </Link>
                            </button>
                        </div>
                    </div>
                    <div className="trailer">
                        {trailerUrl && (
                            <iframe
                                width="560"
                                height="315"
                                src={`${trailerUrl}? autoplay = 1`}
                                title="YouTube trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            >
                            </iframe>
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default MovieDetailsPage;
