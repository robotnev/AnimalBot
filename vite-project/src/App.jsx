import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup_Card from './Signup_Card';
import Login_Card from './Login_Card';
import Yes from './Yes';
import { UserContext } from './UserContext';
import Taskbar from './Taskbar';

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [user, setUser] = useState(() => {
    // Retrieve the user data from storage or set it to null if not found
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <BrowserRouter>
        <Taskbar />
        <Routes>
          <Route path="/" element={<div className="cards">
            <Signup_Card className="card" />
            <Login_Card className="card" />
          </div>} />
          <Route path="/home" element={<Yes />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
