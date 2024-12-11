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
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
      alert('Something went wrong.');
    }
  };

  React.useEffect(() => {
    handleAcceptInvite();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
      <div className="text-center bg-black bg-opacity-40 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4">Processing Your Invite</h1>
        <p className="text-lg">
          Please wait while we process your invitation. You will be redirected
          shortly.
        </p>
      </div>
    </div>
  );
};

export default AcceptInvite;
