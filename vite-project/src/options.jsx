
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function getData() {
  const url = `https://fakestoreapi.com/products`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;

    // Create a container element to hold the data
    const container = document.createElement("div");
    container.className = "data-container";

    // Loop through the results and create HTML elements for each item
    if (results && results.length > 0) {
      results.forEach((result) => {
      const item = document.createElement("div");
      item.className = "data-item";

      // Add the data to the HTML elements
      const title = document.createElement("h2");
      title.textContent = result.title;
      item.appendChild(title);

      const price = document.createElement("p");
      price.textContent = `$${result.price}`;
      item.appendChild(price);

      // Add the item to the container
      container.appendChild(item);
    });
  }

    // Add the container to the page
    document.body.appendChild(container);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default getData;
