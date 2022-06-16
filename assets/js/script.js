var tmdbkey = 'a7086a2a20bcc73d2ef1bcdf2f87ea74';
var localstorageKey = 'movies-tv-watchlist';
var tmdbImgPath = 'https://image.tmdb.org/t/p/w500';
var bodyEl = $('body');
var watchlist = [];

var addToWatchlist = function (content) {
    watchlist.push(content);
    // var newContent = {
    //     title: checkContentAttribute(content.Title),
    //     genre: checkContentAttribute(content.Genre),
    //     type: checkContentAttribute(content.Type),
    //     poster: checkContentAttribute(content.Poster),
    //     release: checkContentAttribute(content.Released),
    //     ratings: checkContentAttribute(content.Ratings),
    //     imdbID: checkContentAttribute(content.imdbID),
    // };
    // watchlist.push(newContent);
    // console.log(watchlist);
}

var checkContentAttribute = function (attribute) {
    if (attribute) {
        return attribute;
    } else {
        return false;
    }
}

var getSortedWatchlist = function (sortType, reverse) {
    var sortedWatchlist = watchlist;
    if (watchlist.length <= 0) { return false; }

    switch (sortType) {
        case 'title': sortedWatchlist.sort(function (a, b) {
            var aText = a.title.toUpperCase();
            var bText = b.title.toUpperCase();
            if (aText < bText) { return -1; }
            else if (aText > bText) { return 1; }
            else { return 0; }
        });
            break;
        case 'release': sortedWatchlist.sort(function (a, b) {
            var aDate = new Date(a.release);
            var bDate = new Date(b.release);
            return aDate.getTime() - bDate.getTime();
        });
            break;
        default: return sortedWatchlist;
    }
    if (reverse) {
        sortedWatchlist.reverse();
    }
    return sortedWatchlist;
}

var createSaveArray = function () {
    if (watchlist.length <= 0) { return false; }
    var saveArray = [], contentObj;
    for (var i = 0; i < watchlist.length; i++) {
        contentObj = {
            id: watchlist[i].id,
            type: watchlist[i].type
        };
        saveArray.push(contentObj);
    }
    return saveArray;
}

var saveWatchlist = function () {
    if (watchlist.length > 0) {
        localStorage.setItem(localstorageKey, JSON.stringify(createSaveArray()));
    }
}

var loadWatchlist = function () {
    console.log
    var loadedList = localStorage.getItem(localstorageKey);
    if (!loadedList) {
        watchlist = [];
    } else {
        loadedList = JSON.parse(loadedList);
        console.log(watchlist);
        for (var i = 0; i < loadedList.length; i++) {
            getDetails(loadedList[i].id, loadedList[i].type,'addToWatchlist');
            console.log(watchlist);
        }
    }
}

var getNowPlaying = function () {
    var apiUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + tmdbkey + '&language=en-US&page=1'
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            })
        }
    })
}
// getNowPlaying();

var getDetails = function (id, type, func) {
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/' + id + '?api_key=' + tmdbkey + '&language=en-US'
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var newObj = {
                    id: data.id,
                    type: type,
                    title: data.title,
                    popularity: data.popularity,
                    poster: data.poster_path,
                    backdrop: data.backdrop_path
                }
                if (data.release_date) {
                    newObj.release = data.release_date;
                } else if (data.first_air_date) {
                    newObj.release = data.first_air_date;
                }

                if (data.genres) {
                    var genres = [];
                    for (var i = 0; i < data.genres.length; i++) {
                        genres.push(data.genres[i].name);
                    }
                    newObj.genres = genres;
                }

                switch (func) {
                    case 'addToWatchlist': watchlist.push(newObj);
                        break;
                    default: console.log(data);
                        break;
                }

                if (data.poster_path) {
                    var imgEl = $('<img>').attr('src', tmdbImgPath + data.poster_path);
                    bodyEl.append(imgEl);
                } else {
                    console.log("None");
                }
            })
        }
    })
}
// getDetails();
var appendToResults = function(data){
    console.log('called');
    for (var i = 0; i < data.length; i++){
        console.log(data[i]);
    }
}

var searchContent = function (query, type) {
    // forces type to be one of two valid types for api call
    if (type !== 'tv') {
        type = 'movie';
    }
    var apiUrl = 'https://api.themoviedb.org/3/search/' + type + '?api_key=' + tmdbkey + '&query=' + query;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                appendToResults(data);
                // getDetails(data.results[0].id, type, 'addToWatchlist');
            })
        }
    })
}
searchContent('fast','movie');
// searchContent('barry','tv');

var movieVideo = function (movieID) {
    var apiUrl = 'https://api.themoviedb.org/3/movie/' + movieID + '/videos?api_key=' + tmdbkey;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            })
        }
    })
}
// movieVideo(338953);

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
releaseDates(338953);

// var movieIDs = [385687,384018,13804,51497,213927,42246,82992,911241,450487,15942,8324,584,13342,113294,9615,38493,49453,545669];
// console.log(movieIDs.length);
// for (var i = 0; i < movieIDs.length; i++){
//     getDetails(movieIDs[i],'movie');
// }
loadWatchlist();