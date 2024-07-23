import React, { useState, useContext, useEffect } from 'react';
import Loading from './Loading';
import Taskbar from './Taskbar';
import { UserContext } from './UserContext';

function Yes() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [categories, setCategories] = useState();

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
      } catch (error) {
        console.error(error);
      }
    }
    fetchData(); // Call the fetchData function
  }, [user]);
  useEffect(() => {
    const url = `https://api.ecommerceapi.io/walmart_search?api_key=669599d40eca9387990d6162&url=https://www.walmart.com/search?query=father%27s%20day%20gift%20ideas`;
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
