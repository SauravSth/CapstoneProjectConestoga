import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore.js';
import Logo from '../../../assets/img/Logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Please enter an email address.';
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email.';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Please enter a password.';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const response = await fetch(`http://localhost:3000/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for sending cookies
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Successfully logged in
          login(data); // Assuming login updates your app state
          navigate('/');
        } else {
          // Handle login error
          setErrors({ ...newErrors, password: data.message });
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white-900 shadow-md rounded-md">
      <img
        src={Logo}
        alt=""
        className=" mx-24 mb-10"
      />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="Email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-greenPercent"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-greenPercent"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-greenPercent text-white rounded-md shadow-sm hover:bg-greenPercentHover"
          >
            Continue with Email
          </button>
        </div>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        By continuing, you agree to our{' '}
        <a
          href="#"
          className="text-blue-600 hover:underline"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="#"
          className="text-blue-600 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>
      <span className="mt-4 block text-sm text-gray-700">
        New to Percent?{' '}
        <Link
          to="/signup"
          className="text-blue-600 hover:underline"
        >
          Register Here
        </Link>
      </span>
    </div>
  );
};

export default Login;
