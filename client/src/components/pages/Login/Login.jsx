// import React, { useState } from 'react';

// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({ email: '', password: '' });
//   const [apiError, setApiError] = useState('');

//   const validateEmail = (email) => {
//     const regularExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regularExpression.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let valid = true;
//     const newErrors = { email: '', password: '' };

//     if (!email) {
//       newErrors.email = 'Please enter an email address.';
//       valid = false;
//     } else if (!validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email.';
//       valid = false;
//     }

//     if (!password) {
//       newErrors.password = 'Please enter a password.';
//       valid = false;
//     }

//     setErrors(newErrors);

//     if (valid) {
//       // API call for login
//       try {
//         const response = await fetch('/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           // Assuming the API returns a JWT token
//           localStorage.setItem('token', data.token);
//           console.log('Login successful, token saved:', data.token);

//           // Redirect to dashboard or another page if needed
//         } else {
//           // Handle invalid credentials or other errors
//           setApiError(data.message || 'Login failed. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error during login:', error);
//         setApiError('An error occurred during login. Please try again later.');
//       }
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 shadow-md rounded-md">
//       <h1 className="text-2xl font-semibold mb-6">Nice to see you again</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label
//             htmlFor="Email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//           />
//           {errors.email && (
//             <p className="mt-2 text-sm text-red-600">{errors.email}</p>
//           )}
//         </div>
//         <div className="mb-6">
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//           />
//           {errors.password && (
//             <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//           )}
//         </div>
//         <div>
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
//           >
//             Continue with Email
//           </button>
//         </div>
//       </form>
//       <p className="mt-4 text-sm text-gray-600">
//         By continuing, you agree to our{' '}
//         <a
//           href="#"
//           className="text-blue-600 hover:underline"
//         >
//           Terms of Service
//         </a>{' '}
//         and{' '}
//         <a
//           href="#"
//           className="text-blue-600 hover:underline"
//         >
//           Privacy Policy
//         </a>
//         .
//       </p>
//       <span className="mt-4 block text-sm text-gray-700">
//         New to Percent?{' '}
//         <Link
//           to="/signup"
//           className="text-blue-600 hover:underline"
//         >
//           Register Here
//         </Link>
//       </span>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore.js';

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
      // Make API call to log in
      try {
        const response = await fetch(`${process.env.MONGO_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Successfully logged in
          login(data.user);
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-6">Nice to see you again</h1>
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
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
