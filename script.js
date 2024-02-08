var bearerToken = config.BEARER_TOKEN;
var afterCreditsId = 179430;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: bearerToken
  }
};

async function searchMovie() {
	try {		
		// Get movie title from search bar
		const movieSearchInput = document.getElementById('movieSearch');
		const movieTitle = movieSearchInput.value;
		
		if (movieTitle.length == 0){
			return;
		}

		// Display the movie details in the #movieDetails div
		const movieDetailsContainer = document.getElementById('movieDetails');
		clearSuggestions(movieDetailsContainer);
		
		const movieIdInfo = await fetchMovieId(movieTitle);
		
		const movieId = movieIdInfo.results[0].id;
		const movieName = movieIdInfo.results[0].original_title;
		
		const postCredsInfo = await fetchMoviePostCreds(movieId);
		
		const postCreds = postCredsInfo.keywords.some(keyword => keyword.id === afterCreditsId);
		//const hasPostCreds = postCreds ? "Yes" : "No";
		let hasPostCreds;

		if(postCreds){
			hasPostCreds = `YES, ${movieName} has a post credits scene, stick around!`;
		}
		else{
			hasPostCreds = `NO post credits scene for ${movieName}, feel free to leave!`;
		}
		
		movieDetailsContainer.innerHTML = `<p>${hasPostCreds}</p>`;
	} 
	catch (error)
	{
		console.error(error);
	}
}

// Fetching movie id from an TMDB API
function fetchMovieId(title) {
	return fetch(`https://api.themoviedb.org/3/search/movie?query=${title}&page=1`, options)
	  .then(response => {
		  return response.json();
	  })
	  .catch(err => {
		  console.error(err);
	  });
}


// Search whether movie has post credits from TMDB API
function fetchMoviePostCreds(movieId) {
	return fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords`, options)
	  .then(response => {
		  return response.json();
	  })
	  .catch(err => console.error(err));
}

// Event listener for the Enter key press
document.addEventListener('DOMContentLoaded', function () {
    const movieSearchInput = document.getElementById('movieSearch');
	const autocompleteResults = document.getElementById('autocompleteResults');
	const movieDetailsContainer = document.getElementById('movieDetails');

	//entering a movie title
	movieSearchInput.addEventListener('input', function () {
		clearSuggestions(movieDetailsContainer);
		searchAndDisplay(movieSearchInput, autocompleteResults)
	});
	
	//clicking a dropdown option
	movieSearchInput.addEventListener('click', function () {
		searchAndDisplay(movieSearchInput, autocompleteResults)
	});

	//allow enter to submit
	movieSearchInput.addEventListener('keydown', function (event) {
		if (event.key === 'Enter') {
			searchMovie();
			clearSuggestions(autocompleteResults);
		}
    });
	
	//handle clicking outside of search bar and autocomplete results
	document.addEventListener('click', function (event) {
        if (!movieSearchInput.contains(event.target) && !autocompleteResults.contains(event.target)) {
            clearSuggestions(autocompleteResults);
        }
    });

});


function searchAndDisplay (movieSearchInput, autocompleteResults) {
	const searchQuery = movieSearchInput.value.trim();
	if (searchQuery.length === 0) {
		autocompleteResults.innerHTML = ''; 
		return;
	}
		
	fetchMovieId(searchQuery)
		.then(results => {
			displayAutocompleteResults(results, movieSearchInput, autocompleteResults);
		})
		.catch(error => {
			console.error(error);
		});
}

function displayAutocompleteResults(results, movieSearchInput, autocompleteResults) {
    clearSuggestions(autocompleteResults);

	results.results.forEach(result => {
		const suggestion = document.createElement('div');
		suggestion.classList.add('autocomplete-suggestion');
		suggestion.textContent = result.original_title;
		suggestion.addEventListener('click', function () {
			movieSearchInput.value = result.original_title;;
			clearSuggestions(autocompleteResults);
			movieSearchInput.focus();
		});
			
		autocompleteResults.appendChild(suggestion);
	});
}


function clearSuggestions(autocompleteResults) {
    autocompleteResults.innerHTML = '';
}
