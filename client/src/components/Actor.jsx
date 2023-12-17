
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Actor.css';


const Actor = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);

  useEffect(() => {
    fetchActorDetails();
  }, [id]);

  const fetchActorDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/actorsdetails/${id}`);
      if (response.ok) {
        const actorData = await response.json();
        setActor(actorData);
      } else {
        console.error('Failed to fetch actor details');
      }
    } catch (error) {
      console.error('Error fetching actor details', error);
    }
  };
  return (
    <div className="actor-page">
      {actor && (
        <>
          <div className="actor-details">
            <img src={actor.image} alt={actor.name} />
            <h2>{actor.name}</h2>
            <p className='dob'>Date of Birth: {actor.dob}</p>
            <p>Biography: {actor.bio}</p>
          </div>

          <div className="known-for-movies">
            <p className='kf'>Known For: </p>
            {actor.movies.map((movie) => (
              <p>{movie}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Actor;