import React, { useState } from 'react';

const Card2 = (formData, setFormData) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  //const [formData, setFormData] = useState({ name: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(''); // Add this state variable to store the logged-in username

  const handleCardClick = () => {
    setIsFormVisible(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.name && formData.password) {
      fetch('http://localhost:3000/login', { method: 'POST', body: JSON.stringify(formData), headers: { 'Content-Type': 'application/json' } })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUsername(formData.name); // Set the logged-in username
            window.location.href = 'http://localhost:5173/home'; // Redirect to the dashboard page
          } else {
            alert('Invalid name or password');
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert('Please enter your name and password');
    }
  };
  const handleShowPasswordChange = (event) => {
    setShowPassword(event.target.checked);
  };
  const handleNameChange = (event) => {
    setFormData({ ...formData, name: event.target.value });
  };
  const handlePasswordChange = (event) => {
    setFormData({ ...formData, password: event.target.value });
  };

  return (
    <div className="card" onClick={handleCardClick}>
      {!isFormVisible && <h2>Login!</h2>}
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label style={{ marginTop: '20px' }}>
            Enter your Username:
            <input
              type="text"
              name="user"
              onChange={handleNameChange}
            />
          </label>
          <br />
          <label style={{ marginTop: '20px' }}>
            Password:
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handlePasswordChange}
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
}

export default Card2;


