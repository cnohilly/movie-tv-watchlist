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
                    case 'addToWatchlist':
                        watchlist.push(contentObj);
                        break;
                    case 'createModal':
                        createModal(contentObj);
                        break;
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
                    default:
                        console.log(data);
                        break;
                }
            })
        }
    })
}

// Gets the currently playing movies
var getNowPlaying = function () {
    var apiUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + tmdbkey + '&language=en-US'
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // returns an object with a results property
                appendToResults(data.results);
            })
        }
    })
}

// Gets the currently popular content for the specific type (movie or tv)
var getPopular = function (type) {
    type = forceType(type);
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/popular?api_key='+tmdbkey+'&language=en-US';
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
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/top_rated?api_key='+tmdbkey+'&language=en-US';
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
                createContentCards(data.results,type,'searchCard');
            })
        }
    })
}

// used to toggle whether the search result section is hidden
var displaySearchSection = function(active){
    var section = $('#search-section');
    if (active) {
        if (section.hasClass('is-hidden')) {
            section.removeClass('is-hidden');
        }
    } else {
        if (!section.hasClass('is-hidden')) {
            section.addClass('is-hidden');
        }
    }
}

// Edits the text on the button for the modal
var modalAddButtonText = function (){
    var id = $('.modal-card').attr('data-content-id');
    var addBtn = $('#modal-add-btn');
    if (!watchlist.map(function(cont){ return cont.id;}).includes(id)){
        addBtn.text('Add to Watchlist');
    } else {
        addBtn.text('In Watchlist');
    }
}

// handles the search form
$('#inner-search-form').on('submit',function(event){
    // prevents normal submission behavior
    event.preventDefault();
    // gets the input from the search box and trims the value
    var input = $('#inputValue').val().trim();
    // sets the box back to blank
    $('#inputValue').val('');
    // gets the active radio button, get the parent label and gets the text, trims it and makes it lowercase
    var type = $('input[name="answer"]:checked').closest('label').text().trim().toLowerCase();
    // forces type to a useable value
    if (type === 'movies'){
        type = 'movie';
    } else {
        type = 'tv';
    }
    if (input){
        searchContent(input,type);
    }
});

// saves the content id to the watchlist if it does not already exist
$('.card-container').on('click','div.card-footer',function(){
    var contentObj = {
        id: $(this).parent().attr('data-content-id'),
        type: $(this).parent().attr('data-content-type')
    }
    if (!watchlist.map(function(cont){ return cont.id;}).includes(contentObj.id)){
        watchlist.push(contentObj);
        saveWatchlist();
        modalAddButtonText();
    } 
});

// will add the piece of content to the watchlist
$('#modal-add-btn').on('click',function(){
    var contentObj = {
        id:  $(this).closest('.modal-card').attr('data-content-id'),
        type:  $(this).closest('.modal-card').attr('data-content-type')
    }
    if (!watchlist.map(function(cont){ return cont.id;}).includes(contentObj.id)){
        watchlist.push(contentObj);
        saveWatchlist();
        modalAddButtonText();
    } 
})

// loads the watchlist from local storage and populates all the sections with content
loadWatchlist();
getPopular('movie');
getPopular('tv');
getTopRated('movie');
getTopRated('tv');