import React, { useState } from 'react';

const Card2 = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const handleCardClick = () => {
    setIsFormVisible(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div className="card" onClick={handleCardClick}>
    {!isFormVisible && <h2>Login!</h2>}
    {isFormVisible && (
        <form>
          <label>
            Name:
            <input
              type="text"
              name="name"
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      )}
    </div>
  );
};

export default Card2;
