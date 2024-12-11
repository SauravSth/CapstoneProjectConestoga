import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import Logo from '../../../assets/img/Logo.png';

const Signup = () => {
  const { groupID } = useParams();

  const [formData, setFormData] = useState({
    username: '',
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Access current URL

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).toLowerCase());
  };

  const sanitizeInput = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-letter characters
  };

  const validateForm = () => {
    let formErrors = {};
    const sanitizedFname = sanitizeInput(formData.fname);
    const sanitizedLname = sanitizeInput(formData.lname);

    // Validate form fields...
    if (!formData.username) formErrors.username = 'Username is required';
    if (!sanitizedFname) formErrors.fname = 'First name is required';
    if (!sanitizedLname) formErrors.lname = 'Last name is required';
    if (!formData.email) formErrors.email = 'Email is required';
    if (!validateEmail(formData.email)) formErrors.email = 'Invalid email';
    if (!formData.password) formErrors.password = 'Password is required';
    if (formData.password.length < 6)
      formErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword)
      formErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword)
      formErrors.confirmPassword = 'Passwords do not match';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setSuccessMessage('');

      // Determine if it's the invite registration or regular signup
      const isInvite = location.pathname.startsWith('/registerFromInvite');

      const apiUrl = isInvite
        ? `http://localhost:3000/api/registerFromInvite/${groupID}`
        : `http://localhost:3000/api/signup`;

      try {
        let response = '';
        if (isInvite) {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.username,
              firstName: sanitizeInput(formData.fname.trim()),
              lastName: sanitizeInput(formData.lname.trim()),
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
            }),
          });
        } else {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.username,
              firstName: sanitizeInput(formData.fname.trim()),
              lastName: sanitizeInput(formData.lname.trim()),
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
            }),
          });
        }

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage('User created successfully! Please log in.');
          // Reset form fields
          setFormData({
            username: '',
            fname: '',
            lname: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          navigate('/login');
        } else {
          setErrors(data.errors || { general: data.message });
        }
      } catch (error) {
        console.error('Error during signup:', error);
        setErrors({
          general: 'Something went wrong. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-gray-200 shadow-md rounded-md">
      <form onSubmit={handleSubmit}>
        <img
          src={Logo}
          alt="Logo"
          className="mx-24 mb-10"
        />

        {/* Form fields */}
        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-greenPercent"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label
            htmlFor="fname"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            name="fname"
            placeholder="Enter First Name"
            value={formData.fname}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-greenPercent"
          />
          {errors.fname && (
            <p className="text-red-500 text-sm">{errors.fname}</p>
          )}
        </div>
        {/* Last Name */}
        <div className="mb-4">
          <label
            htmlFor="lname"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lname"
            placeholder="Enter Last Name"
            value={formData.lname}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-greenPercent"
          />
          {errors.lname && (
            <p className="text-red-500 text-sm">{errors.lname}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-greenPercent"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
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
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-greenPercent"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repeat Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-greenPercent"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-greenPercent text-white py-2 rounded-md hover:bg-greenPercentHover focus:outline-none focus:ring focus:ring-greenPercent"
          >
            {loading ? 'Submitting...' : 'Sign Up'}
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <p className="text-green-500 text-sm mt-4">{successMessage}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4">{errors.general}</p>
        )}
      </form>
      <p className="mt-4 block text-sm text-gray-700">
        <span className="mt-4 block text-sm text-gray-700">
          Already With Us?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </span>
      </p>
    </div>
  );
};

export default Signup;
