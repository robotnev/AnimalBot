import React, { useState, useEffect } from "react";
function Joke() {
  const [joke, setJoke] = useState(null);
  useEffect(() => {
    fetch("https://api.ecommerceapi.io/walmart_search?api_key=669599d40eca9387990d6162&url=https://www.walmart.com/search?query=father%27s%20day%20gift%20ideas", {
    })
      .then((response) => response.json())
      .then((data) => {
        setJoke(data[0].joke);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      {joke && <p>{joke}</p>}
    </div>
  );
}
export default Joke;
