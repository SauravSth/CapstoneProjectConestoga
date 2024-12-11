import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/pages/Home/Home';
import Budget from './components/pages/Budget/Budget';
import BudgetExpense from './components/pages/Budget/BudgetExpense';
import Group from './components/pages/Members/Group';
import AcceptInvite from './components/pages/Members/AcceptedInvite';
import GroupDetails from './components/pages/Members/GroupDetails';
// import Member from './components/pages/Members/Member';
import Goals from './components/pages/Goals/Goals';
import AllExpenses from './components/pages/AllExpenses/AllExpenses';
import BillSplit from './components/pages/BillSplit/BillSplit';
import Categories from './components/pages/Categories/Categories';
import Settings from './components/pages/Settings/Settings';
import Login from './components/pages/Login/Login';
import Signup from './components/pages/Signup/Signup';
import VerifyUser from './components/pages/Signup/VerifyUser';

function App() {
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
              path="/budget/:budgetId"
              element={<BudgetExpense />}
            />
            <Route
              path="/all-expenses"
              element={<AllExpenses />}
            />
            <Route
              path="/bill-split"
              element={<BillSplit />}
            />
            <Route
              path="/group"
              element={<Group />}
            />
            <Route
              path="/group/acceptedInvite/:email/:groupId"
              element={<AcceptInvite />}
            />
            <Route
              path="/group/:id"
              element={<GroupDetails />}
            />

            <Route
              path="/goals"
              element={<Goals />}
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
              path="/verify/:verificationCode"
              element={<VerifyUser />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="/registerFromInvite/:groupID"
              element={<Signup />}
            />
            <Route
              path="/logout"
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
