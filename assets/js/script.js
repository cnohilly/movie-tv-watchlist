var tmdbkey = 'a7086a2a20bcc73d2ef1bcdf2f87ea74';
var localstorageKey = 'movies-tv-watchlist';
var tmdbImgPath = 'https://image.tmdb.org/t/p/w500';
var bodyEl = $('body');
var watchlist = [];



// converts and saves the watchlist to localstorage with just the id and content type
var saveWatchlist = function () {
    // will not save anything if the watchlist is empty
    localStorage.setItem(localstorageKey, JSON.stringify(watchlist));
}

// creates an object with the relevant information from the data provided
var createContentObj = function (data, type) {
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
    if (contentObj.release) {
        var dateString = contentObj.release.split('-');
        contentObj.release = dateString[1] + '/' + dateString[2] + '/' + dateString[0];
    } else {
        contentObj.release = '00/00/0000';
    }
    if (data.genres) {
        var genres = [];
        data.genres.forEach(function (genre) {
            genres.push(genre.name);
        });
        contentObj.genres = genres;
    } else {
        data.genres = ['None'];
    }
    return contentObj;
}

// forces the type to a usable value
var forceType = function (type) {
    if (type !== 'tv') {
        type = 'movie';
    }
    return type;
}

// Formats type for display purposes, 'Movie' and 'TV'
var typeFormat = function (type) {
    if (type === 'movie') {
        return type[0].toUpperCase() + type.substring(1);
    } else if (type === 'tv') {
        return type.toUpperCase();
    }
}

// function to get the details for a movie and determine how to utilize that information
var getDetails = function (id, type, func) {
    // forces type to be one of two valid types for api call
    type = forceType(type);
    var apiUrl = 'https://api.themoviedb.org/3/' + type + '/' + id + '?api_key=' + tmdbkey + '&language=en-US'
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // creates an object to store the relevant information in
                var contentObj = createContentObj(data, type);
                if (func === 'createModal') {
                    createModal(contentObj);
                } else {
                    functionSwitch(contentObj, func);
                }
            })
        }
    })
}

// loops through the array of data to pass information to call the api and create cards
var createContentCards = function (data, type, func) {
    data.forEach(function (content) {
        getDetails(content.id, type, func);
    });
}

// used to toggle whether the modal for content details is displayed
var displayModal = function (active) {
    var modal = $('#movie-modal');
    if (active) {
        modal.addClass('is-active');
    } else {
        modal.removeClass('is-active');
    }
}

var setModalBtnColor = function(id){
    var btn = $('#modal-watchlist-btn');
    if(checkInWatchlist(id)){
        btn.removeClass('is-success');
        btn.addClass('is-danger');
    } else {
        btn.addClass('is-success');
        btn.removeClass('is-danger');
    }
}

// updates the information for the content modal and displays it
var createModal = function (contentObj) {
    $('.modal-card').attr('data-content-id', contentObj.id).attr('data-content-type', contentObj.type);
    $('.modal-card-title').text(contentObj.title);
    $('#modal-poster-img').attr('src', contentObj.poster);
    $('#modal-release p').text(contentObj.release);
    $('#modal-type p').text(typeFormat(contentObj.type));
    $('#modal-genre p').text(contentObj.genres.join(', '));
    $('#modal-popularity p').text(contentObj.popularity * 10 + '%');
    $('#modal-movie-description p').text(contentObj.overview);
    $('#modal-watchlist-btn').text(contentButtonText(contentObj.id));
    setModalBtnColor(contentObj.id);
    displayModal(true);
}

// creates the cards for the content and appends them to the specified container
var createCard = function (data, container) {
    var card = $('.card-template .content-card').clone();
    card.find('.card').attr('data-content-type', data.type).attr('data-content-id', data.id);
    card.find('.poster').attr('src', data.poster);
    card.find('.content-title').text(data.title);
    card.find('.content-date').text(data.release.split('/')[2]);
    card.find('.card-footer-item').text(contentButtonText(data.id));
    container.append(card);
}

// function to get the text to display on the button
var contentButtonText = function (id) {
    if (checkInWatchlist(id)) {
        return 'Remove';
    } else {
        return 'Add to Watchlist';
    }
}

// function to return whether an movie or tv series is in the watchlist for the given id
var checkInWatchlist = function (id) {
    return watchlist.map(function (cont) { return cont.id; }).includes(id.toString());
}

// Removes the id from the watchlist and saves to localstorage
var removeFromWatchlist = function (id) {
    var index = watchlist.map(function (cont) { return cont.id; }).indexOf(id.toString());
    if (index >= 0) {
        watchlist.splice(index, 1);
    }
    saveWatchlist();
}

// handles the action for the card button or modal button (adding or removing for watchlsit)
var watchlistButtonAction = function (id, type) {
    var contentObj = {
        id: id,
        type: type
    }
    // if item is not in the watchlist it gets added, else it is removed
    if (!checkInWatchlist(contentObj.id)) {
        watchlist.push(contentObj);
        saveWatchlist();
        updateCardById(contentObj.id);
    } else {
        removeFromWatchlist(contentObj.id);
        updateCardById(contentObj.id);
    }
}

// handles the click listener for content cards to display modals or add/remove from watchlist
var cardButtonHandler = function (event) {
    var id = $(this).closest('.card').attr('data-content-id');
    var type = $(this).closest('.card').attr('data-content-type');
    // if the footer is clicked, item is added/removed, otherwise the modal is displayed
    if ($(this).hasClass('card-footer')) {
        watchlistButtonAction(id, type);
    } else if ($(this).hasClass('card-info')) {
        getDetails(id, type, 'createModal');
    }
}

// adds event listener for cards
$('.card-container').on('click', '.card-info,.card-footer', cardButtonHandler);

// event listener for button in modal to handle adding or removing from watchlist
$('#modal-watchlist-btn').on('click', function () {
    var id = $(this).closest('.modal-card').attr('data-content-id');
    var type = $(this).closest('.modal-card').attr('data-content-type');
    watchlistButtonAction(id, type);
    displayModal(false);
});

// handles when to hide the modal - cancel button or clicking outside the modal
$('#modal-cancel-btn, .modal-background').on('click', function () {
    displayModal(false);
});
