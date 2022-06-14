var omdbkey = '2361bbe';

var bodyEl = $('body');

var searchMovie = function(contentID){
    var apiUrl = 'http://www.omdbapi.com/?apikey='+omdbkey+'&i='+contentID;
    fetch(apiUrl).then(function(response){
        if(response.ok){
            console.log(response);
            response.json().then(function(data){
                console.log(data);
            });
        }
    }).catch(function(error){
        console.log("Didn't connect");
    })
}


var searchMovieTitle = function(contentName, contentType){
    var apiUrl = 'http://www.omdbapi.com/?apikey='+omdbkey+'&s='+contentName;
    if(contentType){
        apiUrl+= '&type='+contentType;
    }
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
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
            });
        }
    }).catch(function(error){
        console.log("Didn't connect");
    })
}
searchMovieTitle("fast");