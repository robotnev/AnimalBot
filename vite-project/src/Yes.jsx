import React, { useState, useContext, useEffect } from 'react';
import Loading from './Loading';
import Taskbar from './Taskbar';
import { UserContext } from './UserContext';

function Yes() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [categories, setCategories] = useState();
  const [moneymax, setMoneyMax] = useState(0.00);

  const updateUser = (newUser) => {
    setUser(newUser);
  };
  const { user } = useContext(UserContext);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3000/getcat', {
          method: 'POST',
          body: JSON.stringify({ name: user }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setData(data);
        setCategories(data.categories);
        // Select a random category
        const randomIndex = Math.floor(Math.random() * data.categories.length);
        const oneCategory = data.categories[randomIndex];
        console.log(oneCategory); // Output the selected category
        // Make a second request to get the moneymax value
        const moneyResponse = await fetch('http://localhost:3000/getmoney', {
          method: 'POST',
          body: JSON.stringify({ name: user }),
          headers: { 'Content-Type': 'application/json' }
        });
        const moneyData = await moneyResponse.json();
        console.log(moneyData)
        setMoneyMax(moneyData.money);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData(); // Call the fetchData function
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Taskbar />
      <div className="grid-container">
        {data.slice(0, 10).map((item) => (
          <div key={item.id} className="grid-item">
            <p>{item.title}</p>
            <img src={`${item.thumbnail}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default Yes;
