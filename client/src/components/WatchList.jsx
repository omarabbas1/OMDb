import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/WatchList.css'


const Watchlist = (/*{ user }*/) => {
    const [watchList, setWatchList] = useState([]);
    const [reload, setReload] = useState(0);
    useEffect(() => {
        const fetchWatchList = async () => {
            try {
                const response = await fetch('http://localhost:5000/watchlist', {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem('token')}`
                    }
                })
                const data = await response.json();
                setWatchList(data);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchWatchList();
    }, [reload])

    const handleWatchList = async (id) => {
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
            setReload(reload + 1);
        }
    }

    return (
        <div className="watch-list">
            {watchList && watchList.map((movie) => (
                <div key={movie.id} className="card">
                    <Link to={`/movie/${movie.id}`} className="link-no-underline">
                        <img className="card-img-top" src={movie.image} alt={movie.name} style={{ height: "380px", width: "100%" }} />
                    </Link>
                    <div className="card-body">
                        <button key={movie.id} onClick={() => handleWatchList(movie.id)}>Remove</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Watchlist;