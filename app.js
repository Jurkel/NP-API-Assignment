'use strict';

const apiKey = 'Xfxgt0JrLZGbUthpHSKcozko8F0EtKoQEwUkRvLl';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryString(params) {
  const queryItem = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItem.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results').empty();

  for (let i = 0; i < responseJson.data.length; i++) {
    $('#results').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}'>Visit website</a>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
  $('h2').removeClass('hidden');
}

function getNatPark(query, maxResults = 10) {
  const params = {
    stateCode: query,
    limit: maxResults,
    api_key: apiKey
  };

  const queryString = formatQueryString(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
      $('#js-error-message').text(`Something went wrong: ${error.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchInput = $('#js-state-search').val();
    const stateSearch = searchInput.replace(/\s+/g, '');
    const maxResults = $('#js-max-results').val();
    getNatPark(stateSearch, maxResults);
  });
}

$(watchForm);
