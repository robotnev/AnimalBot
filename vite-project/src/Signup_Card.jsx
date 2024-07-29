import React, { useState } from 'react';
import { PrismaClient } from '@prisma/client';
import { UserContext } from './UserContext';
import { useContext } from 'react';

const prisma = new PrismaClient();

const Signup_Card = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useContext(UserContext);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
          for (const category of [
            { name: 'Gaming', value: formData.category1 },
            { name: 'Jewelery', value: formData.category2 },
            { name: 'Women Clothering', value: formData.category3 },
            { name: 'Men Clothing', value: formData.category4 },
            { name: 'Gardening', value: formData.category5 },
          ]) {
            if (category.value === true) {
              categories.push(category.name);
            }
          }
          if (categories.length === 0) {
            alert("Please select at least one category!");
            return;
          }
          formData.categories = categories;
          fetch('http://localhost:3000/create', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
          })
            .then(() => {
              setIsSubmitted(true); // set isSubmitted to true after form submission
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  };

  const handleShowPasswordChange = (event) => {
    setShowPassword(event.target.checked);
  };
  console.log

  return (
    <div className="card" onClick={handleCardClick}>
      {!isFormVisible && <h2>Sign Up!</h2>}
      {isSubmitted && <h2>Submitted!</h2>}
      {isFormVisible && !isSubmitted && ( // check if form has been submitted
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
          <label>
            <p> </p>
            What is your maximum price?:
            <input
              type="number"
              name="moneyAmount"
              step="0.01"
              onChange={(event) =>
                setFormData({ ...formData, moneyAmount: event.target.value })
              }
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
                  }
                />
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
  );
};

export default Signup_Card;
