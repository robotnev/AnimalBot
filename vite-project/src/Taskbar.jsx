import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
const Taskbar = () => {
  const [coinAmount, setCoinAmount] = useState(0);
  const handleCoinChange = (event) => {
    setCoinAmount(event.target.value);
  };
  const saveCoinAmount = () => {
    localStorage.setItem('coinAmount', coinAmount);
  };
  const {user} = useContext(UserContext);
  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  return (
    <div className="taskbar" style={{ backgroundColor: '#ccc', padding: '10px 20px' }}>
      <button onClick={logout} style={{ float: 'right', marginRight: '40px' }}>Logout</button>
    <div>{user}</div>
    </div>
  );
};
export default Taskbar;
