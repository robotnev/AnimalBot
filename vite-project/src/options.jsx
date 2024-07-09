async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
  }
  export async function getData(count) {
    const response = await fetch('https://fakestoreapi.com/products');
    const jsonData = await response.json();
    return jsonData.products.map(product => ({
      ...product,
      imageUrl: product.image
    }));
  }
