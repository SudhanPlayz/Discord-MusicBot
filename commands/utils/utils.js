async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Use 'data' here outside of the fetch block but still inside the async function
        console.log(data);
        return data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }
  module.exports = fetchData;