import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GroupDetails = () => {
  const { id } = useParams(); // Extract the group ID from URL params
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      const response = await fetch(`/api/groups/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setGroup(data);
    };

    fetchGroup();
  }, [id]); // The hook will re-run when the ID changes (i.e., when navigating to a different group)

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      {/* Render additional group details here */}
    </div>
  );
};

export default GroupDetails;
