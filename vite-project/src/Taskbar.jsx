import React, { useState } from 'react';
const Taskbar = () => {
  const [coinAmount, setCoinAmount] = useState(0);
  const handleCoinChange = (event) => {
    setCoinAmount(event.target.value);
  };
  const saveCoinAmount = () => {
    localStorage.setItem('coinAmount', coinAmount);
  };
  return (
    <div className="taskbar" style={{ backgroundColor: '#ccc', padding: '10px 20px' }}>
      <button onClick={() => alert('Logged out!')} style={{ float: 'right', marginRight: '40px' }}>Logout</button>
    </div>
  );
};
export default Taskbar;
