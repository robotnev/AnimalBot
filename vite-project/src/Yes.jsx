import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import Taskbar from './Taskbar';

function Yes() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://api.ecommerceapi.io/walmart_search?api_key=669599d40eca9387990d6162&url=https://www.walmart.com/search?query=father%27s%20day%20gift%20ideas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setData(data.search_results[0].item);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  if (loading) {
    return <Loading />;
  }


  // Return only the first ten items in the data array
  if (Array.isArray(data)) {
    const firstTenItems = data.slice(0, 10);
    return (
      <div>
        <Taskbar />
        <div className="grid-container">
          {firstTenItems.map((item) => (
            <div key={item.id} className="grid-item">
            <p>{item.title}</p>
              <img src={`${item.thumbnail}`} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <div>Error: Data is not an array</div>;
  }
}
export default Yes;
