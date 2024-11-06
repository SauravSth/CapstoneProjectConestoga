import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/pages/Home/Home';
import Budget from './components/pages/Budget/Budget';
import AllExpenses from './components/pages/AllExpenses/AllExpenses';
import Categories from './components/pages/Categories/Categories';
import Settings from './components/pages/Settings/Settings';
import Login from './components/pages/Login/Login';
import Signup from './components/pages/Signup/Signup';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/budget"
              element={<Budget />}
            />
            <Route
              path="/all-expenses"
              element={<AllExpenses />}
            />
            <Route
              path="/categories"
              element={<Categories />}
            />
            <Route
              path="/settings"
              element={<Settings />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="*"
              element={<h1>Page Not Found</h1>}
            />
          </Routes>
        </div>
      </Router>
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  );
}

export default App;
