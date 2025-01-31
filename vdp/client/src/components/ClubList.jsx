import React, { useEffect, useState } from 'react';
import Club from './Club';

function ClubList() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    // Fetch clubs from the server
    fetch('/api/clubs')
      .then((response) => response.json())
      .then((data) => setClubs(data));
  }, []);

  return (
    <div>
      <h2>Clubs</h2>
      <div>
        {clubs.map((club) => (
          <Club key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}

export default ClubList;