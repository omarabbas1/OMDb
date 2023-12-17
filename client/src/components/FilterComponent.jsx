import React, { useState } from 'react';
import '../styles/FilterComponent.css';
const FilterComponent = ({ onFilterChange }) => {

    const [ratingFilter, setRatingFilter] = useState('highestToLowest');
    const [dateFilter, setDateFilter] = useState('recent');


    const handleRatingChange = (e) => {
        setRatingFilter(e.target.value);
        onFilterChange(e.target.value, dateFilter);
    };

    const handleDateChange = (e) => {
        setDateFilter(e.target.value);
        onFilterChange(ratingFilter, e.target.value);
    };

    return (
        <div>
            <div className='filters-comp'>
                <label >Sort by Rating:</label>
                <select className='rate-filter' name="rating" /*value={ratingFilter}*/ defaultValue={""} onChange={handleRatingChange}>
                    <option value="" hidden disabled></option>
                    <option value="highestToLowest">Highest to Lowest</option>
                    <option value="lowestToHighest">Lowest to Highest</option>
                </select>
            </div>

            <div className='filters-comp'>
                <label >Sort by Date:</label>
                <select className='rate-filter' name="date" /*value={dateFilter}*/ defaultValue={""} onChange={handleDateChange}>
                    <option value="" hidden disabled></option>
                    <option value="recent">Most Recent</option>
                    <option value="old">Oldest</option>
                </select>
            </div>
        </div>
    );
};

export default FilterComponent;
