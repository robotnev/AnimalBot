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
        // Make a second request to get the moneymax value
        const moneyResponse = await fetch('http://localhost:3000/getmoney', {
          method: 'POST',
          body: JSON.stringify({ name: user }),
          headers: { 'Content-Type': 'application/json' }
        });
        moneyData = await moneyResponse.json();
        setMoneyMax(moneyData.money);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData(); // Call the fetchData function
  }, [user]);
  useEffect(() => {
    setTimeout(() => {
      const url = `https://api.ecommerceapi.io/walmart_search?api_key=669599d40eca9387990d6162&url=https://www.walmart.com/search?query=${oneCategory}&price_max=${moneyData}&sort=rating_desc&limit=20&points_4_star_rating=2&points_free_shipping=1`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const items = data.search_results[0].item
          const testing = data.search_results
          console.log(items)
          items.forEach(item => {
            item.total_score = (item.rating >= 4 ? 2 : 0);
          });
          items.sort((a, b) => b.total_score - a.total_score);
          console.log(items)
          setData(items);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }, 1000); // Add dependencies
  }, []);
  if (loading) {
    return <Loading />;
  }
  const items = Array.isArray(data) ? data : [data];
  return (
    <div>
      <Taskbar />
      <div className="grid-container">
        {items.slice(0, 10).map((item) => (
          <div key={item.id} className="grid-item">
            <p>{item.title}</p>
            <img src={`${item.thumbnail}`} />
            <div className="details">
              <p>{"Average Rating: " + item.rating}</p>
              <p>{"Shipping Details:" + item.shipping}</p>
              <p>
                {item.before_price !== "" ? (
                  <span>On Sale! Price:  {item.current_price}</span>
                ) : (
                  "Price : " + item.current_price
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Yes;
