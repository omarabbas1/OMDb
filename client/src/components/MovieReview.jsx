import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/MovieReview.css';
import FilterComponent from './FilterComponent';

const MovieReview = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState({
        rating: '',
        review_title: '',
        review_body: ''
    });
    const [reviews, Setreviews] = useState([]);
    const [reload, setReload] = useState(0);
    // const [filter, setFilter] = useState({
    //     date: false,
    //     rating: false
    // })

    const fetchMovie = async () => {
        try {
            const response = await fetch(`http://localhost:5000/movie/${id}`);
            const movie_ = await response.json();
            console.log(movie_);
            setMovie(movie_);
            // console.log(reviews.length);
        }
        catch (error) {
            console.log(error);
        }
    }
    const fetchReviews = async () => {
        const response1 = await fetch(`http://localhost:5000/reviews/${id}`);
        const data = await response1.json();
        console.log(data);
        if (data.message === 'success') {
            Setreviews(data.reviews);
        }
    }

    // useEffect(() => {
    //     fetchMovie();
    // }, [])

    useEffect(() => {
        fetchMovie();
        fetchReviews();
        // handleFilterChange();
    }, [reload])


    const handleAddReview = async () => {
        if (parseInt(reviewData.rating) > 10 || parseInt(reviewData.rating < 10)) {
            alert('Please enter a rating between 1 and 10');
            return;
        }
        const response = await fetch(`http://localhost:5000/reviews/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reviewData })
        })
        const data = await response.json();
        if (data !== 'successfully posted review') {
            alert('Please login to post a review');
            navigate('/registration');
            return;
        }
        console.log('here');
        setReload(reload + 1);
    }

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setReviewData(prevReviewData => ({
            ...prevReviewData,
            [name]: value
        }));
    }

    // const handleFilterChange = (ratingValue, dateValue) => {
    //     console.log(reviews);
    //     if (ratingValue === 'highestToLowest') {
    //         // console.log(reviews.sort((a, b) => b.rating - a.rating));
    //         setReviewData(reviews.sort((a, b) => b.rating - a.rating));
    //     }
    //     else if (ratingValue === 'lowestToHighest') {
    //         console.log(reviews);
    //         console.log(reviews.sort((a, b) => a.rating - b.rating));
    //         setReviewData(reviews.sort((a, b) => a.rating - b.rating));
    //     }
    //     if (dateValue === 'recent') {
    //         setReviewData(reviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
    //     }
    //     else if (dateValue === 'old') {
    //         setReviewData(reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    //     }
    // };
    const handleFilterChange = (ratingValue, dateValue) => {
        let sortedReviews = [...reviews];
        // console.log(ratingValue);
        if (dateValue === 'recent') {
            sortedReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (dateValue === 'old') {
            sortedReviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        if (ratingValue === 'highestToLowest') {
            sortedReviews.sort((a, b) => b.rating - a.rating);
        } else if (ratingValue === 'lowestToHighest') {
            // console.log('here')
            sortedReviews.sort((a, b) => a.rating - b.rating);
        }
        Setreviews(sortedReviews);
    };

    // const handleChecked = async (e) => {
    //     const { name, checked } = e.target;
    //     setFilter(prevFilter => ({
    //         ...prevFilter,
    //         [name]: checked
    //     }));
    //     executeFilter();
    // }

    // const executeFilter = () => {
    //     if (filter.rating) {
    //         setReviewData(reviews.sort((a, b) => b.rating - a.rating));
    //     }
    //     if (filter.date) {
    //         setReviewData(reviews.sort((a, b) => new Date(a.date) - new Date(b.date)));
    //     }
    // }
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return (
        <div className="movies-review">
            <div className="card-container">
                <div key={movie.id} className="card">
                    <img className="card-img-top" src={movie.image} alt={movie.name} style={{ height: "380px", width: "100%" }} />
                </div>
            </div>
            <div className='movie-info'>
                <p>Title: {movie.name}</p>
                <p>Release Date: {movie.year}</p>
            </div>

            <div className='review-section'>
                <div className='add-review'>
                    <div>
                        <label>Review Title:
                            <input type="text" name="review_title" onChange={handleChange} value={reviewData.review_title} required />
                        </label>
                    </div>
                    <div>
                        <label>Rating:
                            <input type="text" name="rating" onChange={handleChange} value={reviewData.rating} required />
                        </label>
                    </div>
                    <div>
                        <label>Detailed Review (up to 500 characters):
                            <textarea name="review_body" rows="4" maxlength="500" onChange={handleChange} value={reviewData.review_body} required></textarea>
                        </label>
                    </div>
                    <button onClick={handleAddReview}>Submit Review</button>
                </div>
                <div className='view-reviews'>
                    {/* <h1>Reviews:</h1> */}

                    <div className='filter'>
                        <FilterComponent onFilterChange={handleFilterChange} />
                    </div>
                    <h3>{reviews.length !== 0 && movie.review_count} Review(s):</h3>
                    {/* Sort By:
                        <label>Ratings
                            <input type="checkbox" name='rating' checked={filter.rating} onChange={handleChecked} />
                        </label>
                        <label>Date
                            <input type="checkbox" name='date' checked={filter.date} onChange={handleChecked} />
                        </label> */}
                    {/* Sort By:
                        <label>Ratings
                            <select onChange={ }>
                                <option value="highesttolowest">Highest to Lowest</option>
                                <option value="lowesttohighest">Lowest to Highest</option>
                                {/* <input type="checkbox" name='rating' checked={filter.rating} onChange={handleChecked} /> */}
                    {/* </select>
                        </label>
                        <label>Date
                            <select onChange={ }>
                                <option value="recent">Newest</option>
                                <option value="old">Oldest</option>
                                <input type="checkbox" name='rating' checked={filter.rating} onChange={handleChecked} />
                            </select>
                        </label>  */}

                    <div className='All-reviews'>
                        {reviews.length !== 0 && reviews.map((review) => (
                            <div className='review-item'>
                                <h4>{review.title}</h4>
                                <p>Created at: {formatDate(review.created_at)}</p>
                                <p>Reviewed by: {review.added_by}</p>
                                <p>Rating: {review.rating}</p>
                                <p>Body: {review.reviewBody}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieReview;