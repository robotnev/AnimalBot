import React, { useState } from 'react';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const Card1 = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleCardClick = () => {
    setIsFormVisible(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("hi")
    const { name, password } = formData;
    fetch('http://localhost:3000/create', { method: 'POST', body: JSON.stringify(formData), headers: { 'Content-Type': 'application/json' } })
  }

  const handleShowPasswordChange = (event) => {
    setShowPassword(event.target.checked);
  }

  return (
    <div className="card" onClick={handleCardClick}>
      {!isFormVisible && <h2>Sign Up!</h2>}
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label style={{ marginTop: '20px' }}>
            User:
            <input
              type="text"
              name="name"
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </label>
          <br />
          <label style={{ marginTop: '20px' }}>
            Password:
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
            />
          </label>
          <br />
          <label>
            Show Password:
            <input
              type="checkbox"
              onChange={handleShowPasswordChange}
            />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      )}
    </div>
  );
};

export default Card1;
