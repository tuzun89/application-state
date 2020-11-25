/*
This program demonstrates how vanilla JS
can be used to build HTML by rewriting the DOM
each time the 'state' changes.

The 'state' of the program is stored in the DOM
therefore, if the page is refreshed all data is lost.

This appears to be the key difference between modern
JS frameworks (react, vue, etc) with their 'Virtual DOM'
facility where only the differences between the 'states'
are rendered.
*/

// List of variables used with refs to HTML tags & ids.
const form = document.querySelector('form');
const input = document.querySelector('#searchTerm');
const resultsSection = document.querySelector('#results');
const watchListSection = document.querySelector('#watch-list');

// API template URL.
const API_URL = 'http://www.omdbapi.com/?apikey=87ec8126&type=movie&s='

// Checks for user input
form.addEventListener('submit', formSubmission);

function formSubmission(event) {
    event.preventDefault(); //prevent browser refresh
    //console.log(event);
    const searchTerm = input.value;
    // If getResults() throws error and catch here
    try {
        getResults(searchTerm)
            .then(showResults);
    } catch (error) {
        console.error(error);
    }
}

function getResults(searchTerm) {
    const url = `${API_URL}${searchTerm}`;
    return fetch(url, {
        //method: 'POST'
    })
        .then(response => response.json())
        .then(data => data.Search);
    /*
    if (data.Error) {
        throw new Error(data.Error);
    }
    return data.Search;
    */
}

function showError(error) {
    resultsSection.innerHTML = `
    <div class="alert alert-danger col" role="alert">
        ${error.message}
    </div>
    `;
}

function showResults(results) {
    console.log(results);
    resultsSection.innerHTML = '';
    let html = '';
    results.forEach(movie => {
        html += getMovieTemplate(movie, 4);
    });
    //console.log(html);
    resultsSection.innerHTML = html;
    const watchListButtons = document.querySelectorAll('.watch-list-button');
    watchListButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const { id } = button.dataset; //destructuring
            const movie = results.find(movie => movie.imdbID === id);
            watchListSection.innerHTML = watchListSection.innerHTML
                + getMovieTemplate(movie, 12, false);
        });
    });
}

/*
Still to implement 'remove' button
on the 'Watch Later' section
*/
function removeWatchList() {
    const index = this.watchList.indexOf(movie);
    this.watchList.splice(index, 1);
}

function getMovieTemplate(movie, cols, button = true) {
    return `
    <div class="card col${cols}" style="width: 18rem;">
        <img class="card-img-top" src="${movie.Poster}" alt="${movie.Title}">
        <div class="card-body">
            <h5 class="card-title">${movie.Title}</h5>
            <p class="card-text">${movie.Year}</p>
            ${button ?  //template literal with ternary operator inside
            `<button data-id="${movie.imdbID}" type="button" class="btn btn-outline-secondary 
                btn-lg btn-block
                watch-list-button">Add to Watchlist</button>`
            : ''
        }
        </div>
    </div>
    `
}