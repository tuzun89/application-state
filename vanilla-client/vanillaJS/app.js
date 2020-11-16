const form = document.querySelector('form');
const input = document.querySelector('#searchTerm');
const resultsSection = document.querySelector('#results');

const API_URL = 'http://www.omdbapi.com/?apikey=87ec8126&type=movie&s='

form.addEventListener('submit', formSubmission);

function formSubmission(event) {
    event.preventDefault();
    const searchTerm = input.value;
    try {
        getResults(searchTerm)
            .then(showResults);
    } catch (error) {
        showError(error);
    }
}

function getResults(searchTerm) {
    const url = `${API_URL}${searchTerm}`;
    fetch(url, {
        method: 'POST',
        mode: 'cors'
    })
        .then(response => response.json())
        .then(data => showResults(data.Search));

    if (data.Error) {
        throw new Error(data.Error);
    }
    return data.Search;
}

function showResults(results) {
    //console.log(results);
    resultsSection.innerHTML = '';
    let html = '';
    results.forEach(element => {
        html + getFilmTemplate(film);
    });
    //console.log(html);
    resultsSection.innerHTML = html;

    const watchLaterButtons = document.querySelectorAll('.watch-later-button');
    watchLaterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const { id } = button.dataset;
            const film = results.find(film => film.imdbID === id);
            console.log(film);
        });
    });
}

function getFilmTemplate(film, button = true) {
    return `
    <div class="card col-4" style="width: 18rem;">
        <img class="card-img-top" src="${element.Poster}" alt="${element.Title}">
        <div class="card-body">
            <h5 class="card-title">${element.Title}</h5>
            <p class="card-text">${element.Year}</p>
            ${button ?
            `<button data-id="${element.imdbID}" type="button" class="btn btn-danger watch-later-button">Watch Later</button>`
            : ''
        }
        </div>
    </div>
    `
}

function showError(error) {
    resultsSection.innerHTML = `
    <div class="alert alert-danger col" role="alert">
        ${error.message}
    </div>
    `;
}
