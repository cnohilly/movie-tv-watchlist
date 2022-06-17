// API Key
var apiKey = "8da71b56dc2b287e98f9875203b81d2c";

var url = "https://api.themoviedb.org/3/search/movie?api_key=8da71b56dc2b287e98f9875203b81d2c&query=toy%20story"

// Selecting elements from the DOM
const buttonEl = document.querySelector("#search");
const inputEl = document.querySelector("#inputValue");





buttonEl.onclick = function(event) {
    event.preventDefault();
    const value = inputEl.value
    

  fetch(url)
      .then((res) => res.json())
      .then((data) => {
          console.log("Data: ", data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      })
  console.log("Value:", value);
    
}

