import React, { useState, useContext, useEffect } from 'react';
import Loading from './Loading';
import Taskbar from './Taskbar';
import { UserContext } from './UserContext';
function Yes() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [categories, setCategories] = useState();
  const [moneyMax, setMoneyMax] = useState(0.0);
  const updateUser = (newUser) => {
    setUser(newUser);
  };
  const { user } = useContext(UserContext);
  let moneyData;
  let oneCategory;
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
        oneCategory = data.categories[randomIndex];
        console.log(oneCategory); // Output the selected category
        // Make a second request to get the moneymax value
        const moneyResponse = await fetch('http://localhost:3000/getmoney', {
          method: 'POST',
          body: JSON.stringify({ name: user }),
          headers: { 'Content-Type': 'application/json' }
        });
        moneyData = await moneyResponse.json();
        console.log("1" + moneyData)
        setMoneyMax(moneyData.money);
        console.log(moneyData)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData(); // Call the fetchData function
  }, [user]);
  useEffect(() => {
    setTimeout(() => {
      console.log("hello")
      console.log(moneyData)
      console.log(oneCategory)
      const url = `https://api.ecommerceapi.io/walmart_search?api_key=669599d40eca9387990d6162&url=https://www.walmart.com/search?query=${oneCategory}&price_max=${moneyData}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setData(data.search_results[0].item);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }, 5000); // Add dependencies
  }, []);
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
