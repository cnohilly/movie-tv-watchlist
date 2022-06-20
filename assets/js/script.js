var tmdbkey = 'a7086a2a20bcc73d2ef1bcdf2f87ea74';
var localstorageKey = 'movies-tv-watchlist';
var tmdbImgPath = 'https://image.tmdb.org/t/p/w500';
var bodyEl = $('body');
var watchlist = [];
var contentArray = [];
var searchContainer = $('#search-results-container');
var popMovieContainer = $('#pop-movies-container');
var popTVContainer = $('#pop-tv-container');
var topMovieContainer = $('#top-movies-container');
var topTVContainer = $('#top-tv-container');

// function to return a sorted array of the watchlist depending on passed in parameters
var getSortedWatchlist = function (sortType, reverse) {
    var sortedWatchlist = watchlist;
    if (watchlist.length <= 0) { return false; }

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
            for (var i = 0; i < watchlist.length; i++) {
                if (watchlist[i].genres && watchlist[i].genres.indexOf(filterValue) >= 0) {
                    filteredWatchlist.push(watchlist[i]);
                }
            }
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

// converts the watchlist to a separate array storing only the id and content type
var createSaveArray = function () {
    // if the watchlist is empty, return false
    if (watchlist.length <= 0) { return false; }
    var saveArray = [], contentObj;
    // loops through the watchlist and only stores the id and content type
    for (var i = 0; i < watchlist.length; i++) {
        contentObj = {
            id: watchlist[i].id,
            type: watchlist[i].type
        };
        saveArray.push(contentObj);
    }
    return saveArray;
}

// converts and saves the watchlist to localstorage with just the id and content type
var saveWatchlist = function () {
    // will not save anything if the watchlist is empty
    if (watchlist.length > 0) {
        localStorage.setItem(localstorageKey, JSON.stringify(createSaveArray()));
    }
}

// attempts to load the watchlist from localstorage and translate it to full information
var loadWatchlist = function () {
    // loads the saved array from localstorage
    var loadedList = localStorage.getItem(localstorageKey);
    // if the list is empty or doesn't exist, sets watchlist to an empty array
    if (!loadedList) {
        watchlist = [];
        // otherwise the list is parsed and looped through to get more details about each piece of content
    } else {
        loadedList = JSON.parse(loadedList);
        for (var i = 0; i < loadedList.length; i++) {
            getDetails(loadedList[i].id, loadedList[i].type, 'addToWatchlist');
        }
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
                console.log(data);
                // creates an object to store the relevant information in
                var contentObj = {
                    id: data.id,
                    type: type,
                    title: data.title,
                    popularity: data.vote_average,
                    overview: data.overview,
                    poster: data.poster_path,
                    backdrop: data.backdrop_path
                }
                if (type === 'movie') {
                    contentObj.title = data.title;
                    contentObj.release = data.release_date;
                } else if (type === 'tv') {
                    contentObj.title = data.name;
                    contentObj.release = data.first_air_date;
                }
                var dateString = contentObj.release.split('-');
                contentObj.release = dateString[1] + '/' + dateString[2] + '/' + dateString[0];

                if (data.genres) {
                    var genres = [];
                    for (var i = 0; i < data.genres.length; i++) {
                        genres.push(data.genres[i].name);
                    }
                    contentObj.genres = genres;
                } else {
                    data.genres = null;
                }

                switch (func) {
                    case 'addToWatchlist':
                        watchlist.push(contentObj);
                        break;
                    case 'appendImage':
                        var imgEl = $('<img>').attr('src', tmdbImgPath + data.poster_path);
                        bodyEl.append(imgEl);
                        break;
                    case 'createContentArray':
                        contentArray.push(contentObj);
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

var forceType = function(type){
    if (type !== 'tv') {
        type = 'movie';
    }
    return type;
}

var typeFormat = function(type){
    if (type === 'movie') {
        return type[0].toUpperCase() + type.substring(1);
    } else if (type === 'tv') {
        return type.toUpperCase();
    }
}

var createContentCards = function (data, type, func) {
    for (var i = 0; i < data.length; i++) {
        getDetails(data[i].id, type, func);
    }
}

// Gets the currently playing movies
var getNowPlaying = function () {
    var apiUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + tmdbkey + '&language=en-US&page=1'
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
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/popular?api_key=a7086a2a20bcc73d2ef1bcdf2f87ea74&language=en-US';
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // returns an object with a results property
                console.log(data);
                createContentCards(data.results, type, 'pop' + typeFormat(type) + 'Card');
            })
        }
    });
}

// Gets the currently popular content for the specific type (movie or tv)
var getTopRated = function (type) {
    type = forceType(type);
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/top_rated?api_key=a7086a2a20bcc73d2ef1bcdf2f87ea74&language=en-US';
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // returns an object with a results property
                console.log(data);
                createContentCards(data.results, type, 'top' + typeFormat(type) + 'Card');
            })
        }
    });
}

// Function to append data
var appendToResults = function (data) {
    for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
    }
}

// Searches for content of the specific type using the passed in query
var searchContent = function (query, type) {
    // forces type to be one of two valid types for api call
    type = forceType(type);
    var apiUrl = 'https://api.themoviedb.org/3/search/' + type + '?api_key=' + tmdbkey + '&query=' + query;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                appendToResults(data.results);
                // getDetails(data.results[0].id, type, 'addToWatchlist');
            })
        }
    })
}

// gets the videos for the speicifc content
var contentVideo = function (id, type) {
    // forces type to be one of two valid types for api call
    type = forceType(type);
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/' + id + '/videos?api_key=' + tmdbkey;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            })
        }
    })
}

// Global release dates for the movie id
var releaseDates = function (movieID) {
    var apiUrl = 'https://api.themoviedb.org/3/movie/' + movieID + '/release_dates?api_key=a7086a2a20bcc73d2ef1bcdf2f87ea74'
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            })
        }
    })
}

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

var displayModal = function (active) {
    var modal = $('#movie-modal');
    if (active) {
        if (!modal.hasClass('is-active')) {
            modal.addClass('is-active');
        }
    } else {
        if (modal.hasClass('is-active')) {
            modal.removeClass('is-active');
        }
    }
}

var createModal = function (contentObj) {
    $('.modal-card-title').text(contentObj.title);
    $('#modal-poster-img').attr('src', tmdbImgPath + contentObj.poster);
    $('#modal-release p').text(contentObj.release);
    $('#modal-type p').text(typeFormat(contentObj.type));
    $('#modal-genre', contentObj.genres.join(', '));
    $('#modal-popularity p').text(contentObj.popularity * 10 + '%');
    $('#modal-movie-description p').text(contentObj.overview);
    displayModal(true);
}

getDetails(73107, 'tv', 'createModal');

// var movieIDs = [385687, 384018, 13804, 51497, 213927, 42246, 82992, 911241, 450487, 15942, 8324, 584, 13342, 113294, 9615, 38493, 49453, 545669];
// console.log(movieIDs.length);
// for (var i = 0; i < movieIDs.length; i++) {
//     getDetails(movieIDs[i], 'movie', 'addToWatchlist');
// }


$('#modal-cancel-btn').on('click', function () {
    displayModal(false);
});

var createCard = function (data, container) {
    var cardContainer = $('<div>').addClass('column is-3-table is-3-desktop');
    var card = $('<div>').addClass('card');
    var divEl = $('<div>').addClass('card-image has-text-centered px-6');
    var imgEl = $('<img>').addClass('mt-1');
    if (data.poster){
        imgEl.attr('src', tmdbImgPath + data.poster);
    } else {
        imgEl.attr('src','./assets/images/No_Image_Available.jpg');
    }
    divEl.append(imgEl);
    card.append(divEl);
    divEl = $('<div>').addClass('card-content');
    var pEl = $('<p>').text(data.title);
    divEl.append(pEl);
    pEl = $('<p>').text(data.release.split('/')[2]).addClass('title is-size-5');
    divEl.append(pEl);
    card.append(divEl);
    var aEl = $('<a>').addClass('card-footer');
    pEl = $('<p>').text('Add to Watchlist').addClass('card-footer-item');
    aEl.append(pEl);
    card.append(aEl);
    cardContainer.append(card);
    container.append(cardContainer);
}

loadWatchlist();
getPopular('movie');
getPopular('tv');
getTopRated('movie');
getTopRated('tv');
