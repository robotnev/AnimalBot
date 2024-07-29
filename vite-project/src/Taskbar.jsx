import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
const Taskbar = () => {

  const {user} = useContext(UserContext);
  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  return (
    <div className="taskbar" style={{ backgroundColor: '#ccc', padding: '10px 20px' }}>
      <button onClick={logout} style={{ float: 'right', marginRight: '40px' }}>Logout</button>
      <div class="user">{user}</div>
    </div>
  );
};
export default Taskbar;
