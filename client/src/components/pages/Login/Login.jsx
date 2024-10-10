import React from 'react';

const Login = () => {
  return (
    <>
      <h1>Nice to see you again</h1>
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

export default Login;
