const form = document.querySelector('form');
const input = document.querySelector('#searchTerm');

const API_URL = 'http://www.omdbapi.com/?apikey=87ec8126&type=movie&s='

form.addEventListener('submit', formSubmission);

function formSubmission(event) {
    event.preventDefault();
    const searchTerm = input.value;
    getResults(searchTerm);
}

function getResults(searchTerm) {
    const url = `${API_URL}${searchTerm}`;
    fetch(url).then(response => response.json()).then(data => {
        console.log(data.Search);
    });
}
