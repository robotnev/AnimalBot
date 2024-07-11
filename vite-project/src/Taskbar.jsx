import React from 'react';
import { username } from 'Card2.jsx';

const Taskbar = ({ username }) => {
  return (
    <div>
      <span>{username}</span>
      <button onClick={() => alert('Logged out!')}>Logout</button>
    </div>
  );
};

export default Taskbar;
