var tmdbkey = 'a7086a2a20bcc73d2ef1bcdf2f87ea74';
var localstorageKey = 'movies-tv-watchlist';
var tmdbImgPath = 'https://image.tmdb.org/t/p/w500';
var bodyEl = $('body');
var watchlist = [];

// converts and saves the watchlist to localstorage with just the id and content type
var saveWatchlist = function () {
    // will not save anything if the watchlist is empty
    if (watchlist.length > 0) {
        localStorage.setItem(localstorageKey, JSON.stringify(watchlist));
    }
}

var createContentObj = function(data,type){
    var contentObj = {
        id: ((data.id) ? data.id : null),
        type: type,
        title: ((data.title) ? data.title : data.name),
        release: ((data.release_date) ? data.release_date : data.first_air_date),
        popularity: ((data.vote_average) ? data.vote_average : 0),
        overview: ((data.overview) ? data.overview : 'There is no description for this title.'),
        poster: ((data.poster_path) ? (tmdbImgPath + data.poster_path) : './assets/images/No_Image_Available.jpg'),
        backdrop: ((data.backdrop_path) ? tmdbImgPath + data.backdrop_path : './assets/images/No_Image_Available.jpg')
    }
    if (contentObj.release){
        var dateString = contentObj.release.split('-');
        contentObj.release = dateString[1] + '/' + dateString[2] + '/' + dateString[0];
    } else {
        contentObj.release = '00/00/0000';
    }
    if (data.genres) {
        var genres = [];
        for (var i = 0; i < data.genres.length; i++) {
            genres.push(data.genres[i].name);
        }
        contentObj.genres = genres;
    } else {
        data.genres = null;
    }
    return contentObj;
}

var forceType = function(type){
    if (type !== 'tv') {
        type = 'movie';
    }
    return type;
}

// Formats type for display purposes, 'Movie' and 'TV'
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

// gets the videos for the specific content
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

// used to toggle whether the modal for content details is displayed
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

// updates the information for the content modal and displays it
var createModal = function (contentObj) {
    $('.modal-card').attr('data-content-id',contentObj.id).attr('data-content-type',contentObj.type);
    $('.modal-card-title').text(contentObj.title);
    $('#modal-poster-img').attr('src', contentObj.poster);
    $('#modal-release p').text(contentObj.release);
    $('#modal-type p').text(typeFormat(contentObj.type));
    $('#modal-genre p').text(contentObj.genres.join(', '));
    $('#modal-popularity p').text(contentObj.popularity * 10 + '%');
    $('#modal-movie-description p').text(contentObj.overview);
    displayModal(true);
}

// creates the cards for the content and appends them to the specified container
var createCard = function (data, container) {
    var card = $('.card-template .content-card').clone();
    card.find('.card').attr('data-content-type',data.type).attr('data-content-id',data.id);
    card.find('.poster').attr('src',data.poster);
    card.find('.content-title').text(data.title);
    card.find('.content-date').text(data.release.split('/')[2]);
    container.append(card);
}

// displays the modal whenever a user clicks on a card
$('.card-container').on('click','.card-info',function(event){
    var id = $(this).closest('.card').attr('data-content-id');
    var type = $(this).closest('.card').attr('data-content-type');
    getDetails(id,type,'createModal');
});

// handles when to hide the modal
$('#modal-cancel-btn, .modal-background').on('click', function () {
    displayModal(false);
});
