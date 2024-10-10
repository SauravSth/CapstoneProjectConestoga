import React from 'react';

const Signup = () => {
  return (
    <>
      <h1>Let's Get Started !</h1>
      <div>
        <label for="Email">Email</label>
        <input
          field="email"
          name="email"
          placeholder="Email"
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          field="password"
          name="password"
          placeholder="Password"
        />
      </div>
      <div>
        <label for="confirmPassword">Confirm Password</label>
        <input
          field="password"
          name="confirmPassword"
          placeholder="Repeat Password"
        />
      </div>
      <div>
        <button>Continue with Email</button>
      </div>
      <div>
        <p>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </>
  );
};

export default Signup;
