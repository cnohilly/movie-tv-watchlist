var omdbkey = '2361bbe';
var contentList;
var bodyEl = $('body');

var fetchUrl = function(url){
    fetch(url).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                return data;
            });
        }
    }).catch(function(error){
        console.log("Could not connect.");
    });
}

var searchMovie = function(contentID){
    var apiUrl = 'http://www.omdbapi.com/?apikey='+omdbkey+'&i='+contentID;
    var data = fetchUrl(apiUrl);
    console.log(data);
}


var searchMovieTitle = function(contentName, contentType){
    var apiUrl = 'http://www.omdbapi.com/?apikey='+omdbkey+'&s='+contentName;
    if(contentType){
        apiUrl+= '&type='+contentType;
    }
    var data = fetchUrl(apiUrl).await();
    console.log(data);
    for (var i = 0; i < data.Search.length; i++){
        var imgPath;
        if (data.Search[i].Poster === 'N/A'){
            imgPath = 'No_Image_Available.jpg';
        } else {
            imgPath = data.Search[i].Poster;
        }
        var imgEl = $('<img>').attr('src',imgPath).addClass('poster-image');
        bodyEl.append(imgEl);
    }
    console.log(data);
    searchMovie(data.Search[0].imdbID);
}

searchMovieTitle("barry");

var saveList = function(){

}