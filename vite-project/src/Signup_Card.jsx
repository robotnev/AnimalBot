import React, { useState } from 'react';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const Signup_Card = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleCardClick = () => {
    setIsFormVisible(true);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const { name } = formData;
    fetch(`http://localhost:3000/checkName/${name}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {
          alert("Name already exists! Please choose a different name.");
        } else {
          const categories = [];
          if (formData.category1 === true) {
            categories.push('Electronics');
          }
          if (formData.category2 === true) {
            categories.push('Jewelery');
          }
          if (formData.category3 === true) {
            categories.push('Women Clothering');
          }
          if (formData.category4 === true) {
            categories.push('Men Clothing');
          }
          if (formData.category5 === true) {
            categories.push('Gardening');
          }
          formData.categories = categories;
          fetch('http://localhost:3000/create', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
          });
        }
      })
      .catch((error) => console.error(error));
  };
  const handleShowPasswordChange = (event) => {
    setShowPassword(event.target.checked);
  }

  return (
    <div className="card" onClick={handleCardClick}>
      {!isFormVisible && <h2>Sign Up!</h2>}
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label style={{ marginTop: '20px' }}>
            Username:
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
          <div className="categories">
          <div className="category-wrap">
            <label>
              Electronics:
              <input
                type="checkbox"
                name="category1"
                onChange={(event) =>
                  setFormData({ ...formData, category1: event.target.checked })
                }
              />
            </label>
            <br />
            <label>
              Jewelery:
              <input
                type="checkbox"
                name="category2"
                onChange={(event) =>
                  setFormData({ ...formData, category2: event.target.checked })
                }
              />
            </label>
            <br />
            <label>
              Women Clothing:
              <input
                type="checkbox"
                name="category3"
                onChange={(event) =>
                  setFormData({ ...formData, category3: event.target.checked })
                }
              />
            </label>
            <br />
            <label>
              Men Clothing:
              <input
                type="checkbox"
                name="category4"
                onChange={(event) =>
                  setFormData({ ...formData, category4: event.target.checked })
                } />
                </label>
                <br />
                <label>
                  Gardening:
                  <input
                    type="checkbox"
                    name="category5"
                    onChange={(event) =>
                      setFormData({ ...formData, category5: event.target.checked })
                    }

              />
            </label>
          </div>
          </div>
          <input type="submit" value="Submit" />
        </form>
      )}
    </div>
  )
};

export default Signup_Card;
