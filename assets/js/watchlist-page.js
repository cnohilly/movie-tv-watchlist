var planToWatchContainer = $('#plan-to-watch-list');

// attempts to load the watchlist from localstorage 
var loadWatchlist = function () {
    // loads the saved array from localstorage
    watchlist = localStorage.getItem(localstorageKey);
    // if the list is empty or doesn't exist, sets watchlist to an empty array
    if (!watchlist) {
        watchlist = [];
        // otherwise the list is parsed and looped through to get more details about each piece of content
    } else {
        watchlist = JSON.parse(watchlist);
        createWatchlistCards();
    }
}

// function to return a sorted array of the watchlist depending on passed in parameters
var getSortedWatchlist = function (sortType, reverse) {
    var sortedWatchlist = watchlist;
    // exits function if watchlist is not large enough to sort
    if (watchlist.length <= 1) { return false; }
    // Determines in which way to sort the list
    switch (sortType) {
        case 'title':
            sortedWatchlist.sort(function (a, b) {
                var aText = a.title.toUpperCase();
                var bText = b.title.toUpperCase();
                if (aText < bText) { return -1; }
                else if (aText > bText) { return 1; }
                else { return 0; }
            });
            break;
        case 'release':
            sortedWatchlist.sort(function (a, b) {
                var aDate = new Date(a.release);
                var bDate = new Date(b.release);
                return aDate.getTime() - bDate.getTime();
            });
            break;
        case 'popularity':
            sortedWatchlist.sort(function (a, b) {
                return a.popularity - b.popularity;
            });
            break;
        default: return sortedWatchlist;
    }
    // Determines if the list should be sorted in ascending or descending manner
    if (reverse) {
        sortedWatchlist.reverse();
    }
    return sortedWatchlist;
}

// Returns an array of the filtered watchlist based on the provided filter type and value to filter for
var getFilteredWatchlist = function (filterType, filterValue) {
    var filteredWatchlist = [];
    if (watchlist.length <= 0) { return false; }

    switch (filterType) {
        case 'genre':
            filteredWatchlist = watchlist.filter(function(content){
                return content.genres.includes(filterValue);
            })
            break;
    }
    return filteredWatchlist;
}

// Function to get all of the genres that exist in the current watchlist
var getWatchlistGenres = function () {
    if (watchlist.length <= 0) { return false; }
    var genres = [];
    for (var i = 0; i < watchlist.length; i++) {
        if (watchlist[i].genres) {
            for (var y = 0; y < watchlist[i].genres.length; y++) {
                if (genres.indexOf(watchlist[i].genres[y]) < 0) {
                    genres.push(watchlist[i].genres[y]);
                }
            }
        }
    }
    return genres;
}

// function to get the details for a movie and determine how to utilize that information
var getDetails = function (id, type, func) {
    // forces type to be one of two valid types for api call
    if (type !== 'tv') {
        type = 'movie';
    }
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/' + id + '?api_key=' + tmdbkey + '&language=en-US'
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // creates an object to store the relevant information in
                var contentObj = createContentObj(data,type);

                switch (func) {
                    case 'watchlistCard':
                        createCard(contentObj,planToWatchContainer);
                        break;
                    case 'createModal':
                        createModal(contentObj);
                        break;
                    default:
                        console.log(data);
                        break;
                }
            })
        }
    })
}

var createWatchlistCards = function(){
    planToWatchContainer.empty();
    watchlist.forEach(function(content){
        getDetails(content.id,content.type,'watchlistCard');
    });
}

loadWatchlist();