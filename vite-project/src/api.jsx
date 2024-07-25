import React, { useState, useContext, useEffect } from 'react';
import Loading from './Loading';
import Taskbar from './Taskbar';
import { UserContext } from './UserContext';
function Api() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [categories, setCategories] = useState();
  const [moneyMax, setMoneyMax] = useState(0.0);
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const { user } = useContext(UserContext);
  let moneyData;
  useEffect(() => {
    if (user == null) {
      return;
    }
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
        // Make a second request to get the moneymax value
        const moneyResponse = await fetch('http://localhost:3000/getmoney', {
          method: 'POST',
          body: JSON.stringify({ name: user }),
          headers: { 'Content-Type': 'application/json' }
        });
        const moneyData = await moneyResponse.json();
        // Loop through all the categories
        const request = data.categories.map(async (category) => {
          // Make a request to the Walmart API for this category
          const url = `https://api.ecommerceapi.io/walmart_search?api_key=669599d40eca9387990d6162&url=https://www.walmart.com/search?query=${category}&sort=rating_desc&limit=20&points_4_star_rating=2&points_free_shipping=1`;
          return fetch(url)
            .then((response) => response.json())
            .then((data) => {
              const items = data.search_results[0].item;
              const scoredItems = [];
              items.forEach(item => {
                if (item.current_price !== undefined) {
                  const currentPrice = item.current_price.match(/\d+(?:\.\d+)?/)[0];
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
              return scoredItems.sort((a, b) => b.total_score - a.total_score);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
            });
        });
        Promise.all(request).then(items => {
          setLoading(false);
          setData(items.flat().filter(item => item != null))
        })
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(); // Call the fetchData function
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  function getTopBundles(stuff, budget) {
    stuff.sort((a, b) => b.total_score - a.total_score);
    const bundles = [];
    let remainingBudget = budget;
    for (const item of stuff) {
      for (let i = 0; i < bundles.length; i++) {
        const bundle = bundles[i];
        if (item.price <= remainingBudget && bundle.items.length < 3) {
          bundle.items.push(item);
          remainingBudget -= item.price;
          break;
        }
      }
      if (!bundles.some(bundle => bundle.items.includes(item))) {
        bundles.push({ items: [item], totalPrice: item.price });
        remainingBudget = budget - item.price;
      }
    }
    console.log(bundles.slice(0, 3));
  }

  const items = Array.isArray(data) ? data : [data];

  getTopBundles(items, moneyData)
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
              onWheel={(e) => {
                const image = e.target;
                const currentScale = image.style.transform || 'scale(1)';
                const originalScale = parseFloat(currentScale.replace('scale(', ''));
                const newScale = parseFloat(currentScale.replace('scale(', '')) + (e.deltaY > 0 ? -0.1 : 0.1);
                if (newScale > originalScale * 2) {
                  newScale = originalScale * 2;
                }
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

export default Api;
