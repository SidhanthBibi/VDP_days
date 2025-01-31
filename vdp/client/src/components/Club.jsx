import React from 'react';
import { Link } from 'react-router-dom';

function Club({ club }) {
  return (
    <div>
      <h3>{club.name}</h3>
      <p>{club.description}</p>
      <Link to={`/club/${club.id}`}>View Club</Link>
    </div>
  );
}

export default Club;