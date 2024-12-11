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
        // Redirect to success page
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

  // Trigger the action when the component loads
  React.useEffect(() => {
    handleAcceptInvite();
  }, []);

  return <div>Verifying the user ...</div>;
};
export default VerifyUser;
