var omdbkey = '2361bbe';
var tmdbkey = 'a7086a2a20bcc73d2ef1bcdf2f87ea74';
var localstorageKey = 'movies-tv-watchlist';
var bodyEl = $('body');
var watchlist = [];

var searchMovie = function (contentID) {
    var apiUrl = 'http://www.omdbapi.com/?apikey=' + omdbkey + '&i=' + contentID;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
                addToWatchlist(data);
            });
        }
    }).catch(function (error) {
        console.log("Didn't connect");
    })
}


var searchMovieTitle = function (contentName, contentType) {
    var apiUrl = 'http://www.omdbapi.com/?apikey=' + omdbkey + '&s=' + contentName;
    if (contentType) {
        apiUrl += '&type=' + contentType;
    }
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                for (var i = 0; i < data.Search.length; i++) {
                    var imgPath;
                    if (data.Search[i].Poster === 'N/A') {
                        imgPath = './assets/images/No_Image_Available.jpg';
                    } else {
                        imgPath = data.Search[i].Poster;
                    }
                    var imgEl = $('<img>').attr('src', imgPath).addClass('poster-image');
                    bodyEl.append(imgEl);
                }
                console.log(data);
                searchMovie(data.Search[0].imdbID);
            });
        }
    }).catch(function (error) {
        console.log("Didn't connect");
    })
}
// searchMovieTitle("fast");
// searchMovieTitle("barry");
// searchMovieTitle("grim adventures");

var addToWatchlist = function (content) {
    var newContent = {
        title: checkContentAttribute(content.Title),
        genre: checkContentAttribute(content.Genre),
        type: checkContentAttribute(content.Type),
        poster: checkContentAttribute(content.Poster),
        release: checkContentAttribute(content.Released),
        ratings: checkContentAttribute(content.Ratings),
        imdbID: checkContentAttribute(content.imdbID),
    };
    watchlist.push(newContent);
    console.log(watchlist);
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
    if (reverse){
        sortedWatchlist.reverse();
    }
    return sortedWatchlist;
}

var saveWatchlist = function () {
    if (watchlist.length > 0) {
        localStorage.setItem(localstorageKey, JSON.stringify(watchlist));
    }
}

var loadWatchlist = function () {
    watchlist = localStorage.getItem(localstorageKey);
    if (!watchlist) {
        watchlist = [];
    } else {
        watchlist = JSON.parse(watchlist);
    }
}

var getNowPlaying = function(){
    var apiUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key='+tmdbkey+'&language=en-US&page=1'
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}
// getNowPlaying();

var getMovieDetails = function(){
    var apiUrl = 'https://api.themoviedb.org/3/movie/338953?api_key='+tmdbkey+'&language=en-US'
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}
// getMovieDetails();

var searchMovies = function(){
    var apiUrl = 'https://api.themoviedb.org/3/search/multi?api_key='+tmdbkey+'&query=fast'
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}
searchMovies();

var movieVideo = function(movieID){
    var apiUrl = 'https://api.themoviedb.org/3/movie/'+movieID+'/videos?api_key='+tmdbkey;
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}
movieVideo(338953);