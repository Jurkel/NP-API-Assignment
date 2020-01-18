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
  $('#js-state-search').val('');
  $('#js-max-results').val('');
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

function validateSearch(stateSearch) {
  const searchInput = stateSearch.replace(/\s+/g, '');
  const trimmedSearch = searchInput.split(',');

  console.log(trimmedSearch);

  if (trimmedSearch > 1) {
    for (let i = 0; i < trimmedSearch.length; i++) {
      if (trimmedSearch[i].length > 2) {
        $('#js-state-search').append(
          `States must be in State Code: (i.e., Arizona = AZ)`
        );
      } else {
        return trimmedSearch.toString();
      }
    }
  } else if (trimmedSearch[0].length > 2) {
    $('#js-error-message').text(
      `States must be in State Code: (i.e., Arizona = AZ)`
    );
  } else {
    return trimmedSearch[0].toString();
  }
}

function watchForm() {
  $('form').submit(event => {
    $('.error-message').empty();
    event.preventDefault();
    let searchCount = 0;

    const stateSearch = $('#js-state-search').val();
    validateSearch(stateSearch);
    const maxResults = $('#js-max-results').val();

    if (maxResults < 1 || maxResults > 50) {
      $('#js-error-message').text(
        'Please enter a valid number between 1 and 50'
      );
    } else {
      getNatPark(stateSearch, maxResults);
    }
  });
}

$(watchForm);
