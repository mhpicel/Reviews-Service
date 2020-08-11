import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FullStar = styled.span`
  color: gold;
`;

const EmptyStar = styled.span`
  color: silver;
`;

const starRating = (rating) => {
  const output = [0, 0, 0, 0, 0];
  for (let i = 0; i < rating; i += 1) {
    output[i] = 1;
  }
  return output;
};

const RatingDisplay = ({ rating }) => {
  const ratingArray = starRating(rating);
  return (
    <span>
      {ratingArray.map((index) => {
        if (index === 1) {
          return (<FullStar>&#9733;</FullStar>);
        }
        return (<EmptyStar>&#9733;</EmptyStar>);
      })}
    </span>
  );
};

RatingDisplay.propTypes = {
  rating: PropTypes.number.isRequired
};

export default RatingDisplay;
