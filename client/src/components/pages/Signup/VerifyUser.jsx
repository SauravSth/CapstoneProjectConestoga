import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyUser = () => {
  const navigate = useNavigate();
  const isInitial = React.useRef(true);
  const { verificationCode } = useParams();

  const handleAcceptInvite = async () => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/api/verify/${verificationCode}`
      );

      if (response.data.success) {
        navigate('/login');
        alert('Successfully Verified');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Something went wrong.');
    }
  };

  React.useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      handleAcceptInvite();
    }
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
