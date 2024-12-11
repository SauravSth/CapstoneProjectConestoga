import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyUser = () => {
  const { verificationCode } = useParams();
  const navigate = useNavigate();

  const handleAcceptInvite = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/verify/${verificationCode}`
      );

      if (response.data.success) {
        console.log(response);
        alert('Successfully Verified');
        navigate('/login');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Something went wrong.');
    }
  };

  React.useEffect(() => {
    handleAcceptInvite();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-400 to-teal-400 text-white">
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Verifying...</h1>
        <p className="text-lg">Please wait while we verify your account.</p>
      </div>
    </div>
  );
};

export default VerifyUser;
