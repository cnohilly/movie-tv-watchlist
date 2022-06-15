var tmdbkey = 'a7086a2a20bcc73d2ef1bcdf2f87ea74';
var localstorageKey = 'movies-tv-watchlist';
var tmdbImgPath = 'https://image.tmdb.org/t/p/w500';
var bodyEl = $('body');
var watchlist = [];

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

var getMovieDetails = function(id,type){
    var apiUrl = 'https://api.themoviedb.org/3/'+type+'/'+id+'?api_key='+tmdbkey+'&language=en-US'
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}
// getMovieDetails();

var searchContent = function(query,type){
    // forces type to be one of two valid types for api call
    if (type !== 'tv') {
        type = 'movie';
    }
    var apiUrl = 'https://api.themoviedb.org/3/search/'+type+'?api_key='+tmdbkey+'&query='+query;
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                getMovieDetails(data.results[0].id,type);
            })
        }
    })
}
searchContent('fast','movie');
searchContent('barry','tv');

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
// movieVideo(338953);

var releaseDates = function(movieID){
    var apiUrl = 'https://api.themoviedb.org/3/movie/'+movieID+'/release_dates?api_key=a7086a2a20bcc73d2ef1bcdf2f87ea74'
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}
// releaseDates(338953);
