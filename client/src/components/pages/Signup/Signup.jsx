import React, { useState } from 'react';
import Logo from '../../../assets/img/Logo.png';

const Signup = () => {
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

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).toLowerCase());
  };

  const sanitizeInput = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, ''); // Remove any characters that are not letters or spaces
  };

  const validateForm = () => {
    let formErrors = {};

    // Sanitize first and last name fields
    const sanitizedFname = sanitizeInput(formData.fname.trim());
    console.log(sanitizedFname);
    debugger;
    const sanitizedLname = sanitizeInput(formData.lname.trim());
    console.log(sanitizedLname);
    debugger;
    // Username validation
    if (!formData.username) {
      formErrors.username = 'Username is required';
    }

    // First name validation
    if (!sanitizedFname) {
      formErrors.fname = 'First name is required';
    } else if (/\d/.test(formData.fname)) {
      formErrors.fname = 'First name cannot contain numbers';
    }

    // Last name validation
    if (!sanitizedLname) {
      formErrors.lname = 'Last name is required';
    } else if (/\d/.test(formData.lname)) {
      formErrors.lname = 'Last name cannot contain numbers';
    }

    // Email validation
    if (!formData.email) {
      formErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      formErrors.email = 'Email is not valid';
    }

    // Password validation
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(formErrors);

    // If no errors, return true
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
      // If form is valid, submit data
      setLoading(true);
      setSuccessMessage('');

      try {
        const response = await fetch(`http://localhost:3000/api/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            firstName: sanitizeInput(formData.fname),
            lastName: sanitizeInput(formData.lname),
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        });

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
    <div className="max-w-md mx-auto mt-24 p-6 bg-white-900 shadow-md rounded-md">
      <form onSubmit={handleSubmit}>
        <img
          src={Logo}
          alt="Logo"
          className="mx-24 mb-10"
        />

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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-greenPercent text-white py-2 rounded-md hover:bg-greenPercentHover focus:outline-none focus:ring focus:ring-greenPercent"
          >
            {loading ? 'Submitting...' : 'Sign Up'}
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-sm mt-4">{successMessage}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4">{errors.general}</p>
        )}
      </form>
    </div>
  );
};

export default Signup;
