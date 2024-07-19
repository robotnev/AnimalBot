async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}
export async function getData() {
  const url = "https://api.ecommerceapi.io/walmart_search?api_key=669599d40eca9387990d6162&url=https://www.walmart.com/search?query=father%27s%20day%20gift%20ideas"
  try {
    const data = await fetchData(url);
    return data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
