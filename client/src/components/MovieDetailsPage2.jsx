import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/MovieDetailsPage2.css';
const MovieDetailsPage2 = ({ user, setUser }) => {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const [trailerUrl, setTrailerUrl] = useState('');
    const [actorslist, setActors] = useState([]);
    const [watchListStatus, setWatchListStatus] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPage();
    }, []);

    useEffect(() => {
        fetchWatchList();
        // console.log(watchListStatus);
    }, []);

    // useEffect(() => {
    //     console.log(' Log when movie updates', movie);
    //     console.log('Log when trailerUrl updates', trailerUrl); // Log when trailerUrl updates
    // }, [movie, trailerUrl]);

    const fetchPage = async () => {
        try {
            const response = await fetch(`http://localhost:5000/movie/${id}`);
            const movie_ = await response.json();
            setMovie(movie_);
            const trailerUrl = await fetchYouTubeTrailer(movie_.name);
            setTrailerUrl(trailerUrl);
            const response1 = await fetch(`http://localhost:5000/actors/`);
            const actorsrecord = await response1.json();
            setActors(actorsrecord);
        }
        catch (error) {
            console.log(error);
        }
    }
    const fetchWatchList = async () => {
        const response2 = await fetch(`http://localhost:5000/watchlist/checkwatchlist/${id}`, {
            headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
        });
        const data = await response2.json();
        console.log(data);
        if (data === 'movie in watchlist') {
            setWatchListStatus(true);
        }
    }
    const addWatchList = async () => {
        const response = await fetch('http://localhost:5000/watchlist/additem', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        const data = await response.json();
        setWatchListStatus(true);
        if (data.message !== 'success') {
            alert('Please login to add to Watchlist');
            setUser(null);
            navigate('/registration');
        }
    }
    const removeWatchList = async () => {
        console.log(id);
        const response = await fetch('http://localhost:5000/watchlist/deleteitem', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        const data = await response.json();
        if (data === 'movie successfully removed from watchlist') {
            setWatchListStatus(false);
        }
    }
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

    const handleReviewPage = () => {
        navigate(`/movie/reviews/${id}`);
    }
    return (
        // <div className="movies-details-page2">
        //     <div className='movie-overview'>
        //         <h2>{movie.name}</h2>
        //         <h2>Genre: {movie.genre}</h2>
        //     </div>
        //     <div className="card-container">
        //         <div key={movie.id} className="card">
        //             <img className="card-img-top" src={movie.image} alt={movie.name} style={{ height: "380px", width: "100%" }} />
        //             <div className="card-body">
        //                 <button onClick={handleWatchList}>Add to Watchlist</button>
        //             </div>
        //         </div>
        //     </div>
        //     <div className='top-cast'>
        //         {actorslist.length > 1 && movie.actors.map((actor) => {
        //             const foundActor = actorslist.find((actorRec) => actorRec.name === actor);
        //             if (foundActor) {
        //                 return (
        //                     <div className='actor-item'>
        //                         <img src={foundActor.image} alt={actor} />
        //                         <p>{actor}</p>
        //                     </div>
        //                 );
        //             }
        //             else {
        //                 return null;
        //             }
        //         })}
        //     </div>
        //     <div className="trailer">
        //         {trailerUrl && (
        //             <iframe
        //                 width="560"
        //                 height="315"
        //                 src={`${trailerUrl}?autoplay=1`}
        //                 title="YouTube trailer"
        //                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        //                 allowFullScreen
        //             ></iframe>
        //         )}
        //     </div>
        //     <div className='movie-information'>
        //         <p>Director: {movie.director}</p>
        //         <p>Writer: {movie.writer}</p>
        //         <p>Star: {movie.star}</p>
        //     </div>
        //     <div className='movie-review'>
        //         <button onClick={handleReviewPage}>View Movie Reviews</button>
        //     </div>
        // </div>
        // Additional commented code
        // <div className="featured-container">
        //     <h2>Featured today</h2>

        // </div>
        <div className="movies-details-page2">
            <div className="card-container">
                <div key={movie.id} className="card">
                    {/* Card Content */}
                    <img
                        className="card-img-top"
                        src={movie.image}
                        alt={movie.name}
                        style={{ height: "380px", width: "100%" }}
                    />
                    <div className="card-body">
                        {!watchListStatus ? (
                            <button onClick={addWatchList}>Add to Watchlist</button>
                        ) : (
                            <button onClick={removeWatchList}>Added to WatchList</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="movie-details2">
                <div className="movie-overview">
                    <h2>{movie.name}</h2>
                </div>

                <div className="movie-information">
                    <p>Genre: {movie.genre}</p>
                    <p>Director: {movie.director}</p>
                    <p>Writer: {movie.writer}</p>
                    <p>Rating: {movie.star}</p>
                    {/* <Link to={`/actors/${movie.movie_star}`} className="link-no-underline">
                        <p>Star: {movie.movie_star}</p>
                    </Link> */}
                    <p>More Actors:</p>
                </div>

                <div className="top-cast">
                    {actorslist.length > 1 &&
                        movie.actors.map((actor) => {
                            const foundActor = actorslist.find(
                                (actorRec) => actorRec.name === actor
                            );
                            if (foundActor) {
                                return (
                                    <div className="actor-item" key={actor}>
                                        <Link to={`/actors/${foundActor.id}`} className="link-no-underline">
                                            <img src={foundActor.image} alt={actor} />
                                            <p>{actor}</p>
                                        </Link>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}
                </div>

                <div className="movie-review">
                    <button onClick={handleReviewPage}>Movie Reviews</button>
                </div>
            </div>

            <div className="trailer">
                {trailerUrl && (
                    <iframe
                        width="560"
                        height="315"
                        src={`${trailerUrl}?autoplay=1`}
                        title="YouTube trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
            <div className='other-trailers2'>
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


    );
}


export default MovieDetailsPage2;