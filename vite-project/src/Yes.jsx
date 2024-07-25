import React, { useState, useContext, useEffect } from 'react';
import Loading from './Loading';
import Taskbar from './Taskbar';
import { UserContext } from './UserContext';
function Yes() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [categories, setCategories] = useState();
  const [moneyMax, setMoneyMax] = useState(0.0);
  const scoredItems = [];
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const { user } = useContext(UserContext);
  let moneyData;
  let oneCategory;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/getcat', {
          method: 'POST',
          body: JSON.stringify({ name: user }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setData(data);
        setCategories(data.categories);
        // Loop through all the categories
        data.categories.forEach(async (category) => {
          // Make a second request to get the moneymax value
          const moneyResponse = await fetch('http://localhost:3000/getmoney', {
            method: 'POST',
            body: JSON.stringify({ name: user }),
            headers: { 'Content-Type': 'application/json' }
          });
          const moneyData = await moneyResponse.json();
          // Make a request to the Walmart API for this category
          const url = `https://api.ecommerceapi.io/walmart_search?api_key=669599d40eca9387990d6162&url=https://www.walmart.com/search?query=${category}&sort=rating_desc&limit=20&points_4_star_rating=2&points_free_shipping=1`;
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              const items = data.search_results[0].item;
              console.log(items);
              items.forEach(item => {
                if (item.current_price !== undefined) {
                  const currentPrice = item.current_price.match(/\d+(\.\d+)?/)[0];
                  if (currentPrice < moneyData) {
                    let totalScore = 0;
                    if (item.availability_status === "In stock") {
                      totalScore += 2;
                    }
                    if (item.sponsored) {
                      totalScore += 2;
                    }
                    if (item.rating >= 4.7) {
                      totalScore += 3;
                    } else if (item.rating >= 4.2) {
                      totalScore += 2;
                    } else if (item.rating >= 3.5) {
                      totalScore += 1;
                    }
                    if (item.shipping.includes("Free shipping")) {
                      totalScore += 2;
                    }
                    item.total_score = totalScore;
                    if (item.total_score > 0) {
                      scoredItems.push(item);
                    }
                  }
                }
              });
              scoredItems.sort((a, b) => b.total_score - a.total_score);
              setData(scoredItems);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
            });
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(); // Call the fetchData function
  }, [user]);
  if (loading) {
    return <Loading />;
  }
  const items = Array.isArray(data) ? data : [data];
  console.log(items)
  return (
    <div>
      <Taskbar />
      <div className="grid-container">
        {items.map((item) => (
          <div key={item.id} className="grid-item">
            <p>{item.title}</p>
            <img
              src={item.thumbnail}
              className="image"
              onMouseOver={(e) => {
                e.target.style.cursor = 'zoom-in';
              }}
              onMouseOut={(e) => {
                e.target.style.cursor = 'default';
              }}
            />
            <div className="details">
              <p>{"Average Rating: " + item.rating}</p>
              <p>{"Shipping Details:" + item.shipping}</p>
              <p>{ }</p>
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
