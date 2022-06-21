// API Key
const apiKey = "8da71b56dc2b287e98f9875203b81d2c"
const imgURL = "https://image.tmdb.org/t/p/w500/"
// API Endpoint
const url = "https://api.themoviedb.org/3/search/movie?api_key=8da71b56dc2b287e98f9875203b81d2c&query="

//selecting elements from the DOM
const searchBtnEl = document.querySelector("#search")
const inputEl = document.querySelector("#inputValue")
const movieSearchableEl = document.querySelector("#movie-searchable")



/* Writing some Javascript that will DYNAMICALLY give us OUTPUT BELOW
      <div class="movie">
       
        <section class="section">
          <img src="https://image/tmbd.org/t/p/w500/rZd0y1X1Gw4t5B3f01Qzj8DYY66.jpg"
           alt="" 
           data-movie-id="557" 
           />
          <img src="https://image/tmbd.org/t/p/w500/rjbNpRMoVvqHmhmksbokcyCr7wn.jpg" 
          alt="" 
          data-movie-id="429617" 
          />
        </section>
        
        <div class="content">
          <p id="content-close">X</p>
        </div>
      </div>
*/     

var movieSection = function(movies) {
  return movies.map((movie) => {
    if (movie.poster_path){
      return `<img 
        src=${imgURL + movie.poster_path} 
        data-movie-id=${movie.id}/>`;
     }
  })
}

var createMovieContainer = function (movies){
    // Created <div> in movie 
    const movieEl = document.createElement("div");
    movieEl.setAttribute("class", "movie");


    const movieTemplate = `
        <section class="section">
         ${movieSection(movies)}
        </section>
        
        <div class="content">
          <p id="content-close">X</p>
        </div>
    `;

    movieEl.innerHTML =  movieTemplate;
    return movieEl;

}


const renderSearchMovies = function(data) {
  // When user search another movie, the previous results will erase and display the new search results (movieSearchableEl.innerHTML= "";)
     movieSearchableEl.innerHTML = "";
     const movies = data.results
     const movieBlock = createMovieContainer(movies);
     movieSearchableEl.appendChild(movieBlock);
     console.log("Data", data);
}


searchBtnEl.onclick = function(event) {
event.preventDefault();
    
// to save input value
const value = inputEl.value;

// Clear input bar
inputEl.value = "";

// Whatever is placed in inputEl, will be searched 
const newUrl = url + "&query=" + value

fetch(newUrl)
.then((res) => res.json()) 
.then(renderSearchMovies)
.catch((error) => {
    console.log("Error: ", error)
});
    
console.log("Value ", value);

    
}



// modal
