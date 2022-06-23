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

// switch to determine which function or parameters to use
var functionSwitch = function(contentObj,func){
    switch (func) {
        case 'watchlistCard':
            createCard(contentObj,planToWatchContainer);
            break;
    }
}

// loops through the watchlist to create cards for each piece of content
var createWatchlistCards = function(){
    planToWatchContainer.empty();
    watchlist.forEach(function(content){
        getDetails(content.id,content.type,'watchlistCard');
    });
}

// removes a card from the screen for the specific id
var updateCardById = function (id) {
    // plays small slide animation to hide the element then removes the element once the animation is complete
    $('.card[data-content-id='+id+']').closest('.content-card').slideUp(250,function(){
        $(this).remove();
    });
}

loadWatchlist();