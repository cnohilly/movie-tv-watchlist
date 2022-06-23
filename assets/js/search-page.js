var searchContainer = $('#search-results-container');
var popMovieContainer = $('#pop-movies-container');
var popTVContainer = $('#pop-tv-container');
var topMovieContainer = $('#top-movies-container');
var topTVContainer = $('#top-tv-container');

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
    }
}

// switch to determine which function or parameters to use
var functionSwitch = function (contentObj, func) {
    switch (func) {
        case 'searchCard':
            createCard(contentObj, searchContainer);
            break;
        case 'popMovieCard':
            createCard(contentObj, popMovieContainer);
            break;
        case 'popTVCard':
            createCard(contentObj, popTVContainer);
            break;
        case 'topMovieCard':
            createCard(contentObj, topMovieContainer);
            break;
        case 'topTVCard':
            createCard(contentObj, topTVContainer);
            break;
    }
}

// Gets the currently popular content for the specific type (movie or tv)
var getPopular = function (type) {
    type = forceType(type);
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/popular?api_key=' + tmdbkey + '&language=en-US';
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // returns an object with a results property
                createContentCards(data.results, type, 'pop' + typeFormat(type) + 'Card');
            })
        }
    });
}

// Gets the currently popular content for the specific type (movie or tv)
var getTopRated = function (type) {
    type = forceType(type);
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/top_rated?api_key=' + tmdbkey + '&language=en-US';
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // returns an object with a results property
                createContentCards(data.results, type, 'top' + typeFormat(type) + 'Card');
            })
        }
    });
}

// Searches for content of the specific type using the passed in query
var searchContent = function (query, type) {
    // forces type to be one of two valid types for api call
    type = forceType(type);
    var apiUrl = 'https://api.themoviedb.org/3/search/' + type + '?api_key=' + tmdbkey + '&query=' + query;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                searchContainer.empty();
                displaySearchSection(true);
                createContentCards(data.results, type, 'searchCard');
            })
        }
    })
}

// used to toggle whether the search result section is hidden
var displaySearchSection = function (active) {
    var section = $('#search-section');
    if (active) {
            section.removeClass('is-hidden');
    } else {
            section.addClass('is-hidden');
    }
}

// updates the text for the footer item for the card with the specific id
var updateCardById = function (id) {
    $('.card[data-content-id='+id+']').find('.card-footer-item').text(contentButtonText(id));
}

// handles the search form
$('#inner-search-form').on('submit', function (event) {
    // prevents normal submission behavior
    event.preventDefault();
    // gets the input from the search box and trims the value
    var input = $('#inputValue').val().trim();
    // sets the box back to blank
    $('#inputValue').val('');
    // gets the active radio button, get the parent label and gets the text, trims it and makes it lowercase
    var type = $('input[name="answer"]:checked').closest('label').text().trim().toLowerCase();
    // forces type to a useable value
    if (type === 'movies') {
        type = 'movie';
    } else {
        type = 'tv';
    }
    if (input) {
        searchContent(input, type);
    }
});

// loads the watchlist from local storage and populates all the sections with content
loadWatchlist();
getPopular('movie');
getPopular('tv');
getTopRated('movie');
getTopRated('tv');
