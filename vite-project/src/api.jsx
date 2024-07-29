import React, { useState, useContext, useEffect } from 'react';
import Loading from './Loading';
import Taskbar from './Taskbar';
import { UserContext } from './UserContext';
function Api() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [categories, setCategories] = useState();
  const [moneyMax, setMoneyMax] = useState(0.0);
  const [reset, setReset] = useState();
  const updateUser = (newUser) => {
    setUser(newUser);
  };


  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleRefresh = (title) => {
    handleRefresh(<button onClick={() => refresh('refresh')} className="new-button-style">Refresh Recommendations</button>);
    setLoading(true);
  };


  const refresh = (buttonId, title) => {
    const button = document.getElementById(buttonId);
    button.innerHTML = 'Added';
    const newButton = document.createElement('button');
    newButton.innerHTML = title;
    // Add styles to position the button on top of the page
    newButton.innerHTML = 'Refresh Recommendations';
    newButton.style.position = 'absolute';
    newButton.style.top = '12%';
    newButton.style.left = '50%';
    newButton.style.transform = 'translate(-50%, -40%)';
    newButton.style.border = '1px solid black';
    // Add an event listener to the new button
    newButton.addEventListener('click', () => {
      newButton.remove();
      setLoading(true)
      const category = title;
      const moneyData = moneyMax
      const url = `https://api.ecommerceapi.io/walmart_search?api_key=&url=https://www.walmart.com/search?query=${category}&sort=rating_desc&limit=20&points_4_star_rating=2&points_free_shipping=1`;
      fetch(url)
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
          })
          return scoredItems.sort((a, b) => b.total_score - a.total_score);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
      Promise.all(request).then(items => {
        setLoading(false);
        setData(items.flat().filter(item => item != null))

      })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
      setData(data); // Call the fetchData function

    });
    // Append the new button to the DOM
    document.body.appendChild(newButton);
  };



  const { user } = useContext(UserContext);
  let moneyData = 0;
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
        moneyData = await moneyResponse.json();
        setMoneyMax(moneyData);
        // Loop through all the categories
        const request = data.categories.map(async (category) => {
          // Make a request to the Walmart API for this category
          const url = `https://api.ecommerceapi.io/walmart_search?api_key=66a47d940ba5330431a7b944&url=https://www.walmart.com/search?query=${category}&sort=rating_desc&limit=20&points_4_star_rating=2&points_free_shipping=1`;
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
  // user see 3 bundles
  // user can pick
  // each item from 1-3 goes into a new bundle
  // then goes descending order
  // until each bundle reach budget
  function getTopBundles(stuff, set) {
    stuff.sort((a, b) => b.total_score - a.total_score);
    const lowestItem = stuff.reduce((min, item) => {
      return item.current_price < min.current_price ? item : min;
    }, stuff[0]);
    const budget = set;
    const bundles = [];
    for (const item of stuff) {
      const currentBundle = [];
      let currentBudget = 0;
      for (const innerItem of stuff) {
        if (currentBudget + innerItem.current_price <= budget) {
          currentBundle.push(innerItem.title);
          currentBudget += innerItem.current_price;
        } else {
          break;
        }
      }
      bundles.push(currentBundle);
    }
    console.log(bundles.slice(0, 3));
  }

  const items = Array.isArray(data) ? data : [data];
  getTopBundles(items, moneyMax)
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
                let newScale = parseFloat(currentScale.replace('scale(', '')) + (e.deltaY > 0 ? -0.015 : 0.015);
                if (currentScale * 1.75 > newScale) {
                  newScale = currentScale * 1.75
                }
                image.style.transform = `scale(${newScale})`
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
            <button id="add-button" onClick={() => refresh('add-button', item.title.toString())} className="new-button-style" style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -40%)' }}>Add</button>          </div>
        ))}
      </div>
    </div>
  )

}

export default Api;
