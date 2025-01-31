import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Club from '../components/Club';

const ClubPage = () => {
    const { clubId } = useParams();
    const [clubData, setClubData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const response = await fetch(`/api/clubs/${clubId}`);
                const data = await response.json();
                setClubData(data);
            } catch (error) {
                console.error('Error fetching club data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubData();
    }, [clubId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!clubData) {
        return <div>Club not found.</div>;
    }

    return (
        <div>
            <h1>{clubData.name}</h1>
            <Club club={clubData} />
            {/* Additional club details can be displayed here */}
        </div>
    );
};

export default ClubPage;