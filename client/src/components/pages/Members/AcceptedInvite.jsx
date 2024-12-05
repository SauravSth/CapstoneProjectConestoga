import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AcceptInvite = () => {
  const { email, groupId } = useParams();
  const navigate = useNavigate();

  const handleAcceptInvite = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/group/acceptedInvite/${email}/${groupId}`
      );

      if (response.data.success) {
        // Redirect to success page
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
      alert('Something went wrong.');
    }
  };

  // Trigger the action when the component loads
  React.useEffect(() => {
    handleAcceptInvite();
  }, []);

  return <div>Processing your invite...</div>;
};

export default AcceptInvite;
