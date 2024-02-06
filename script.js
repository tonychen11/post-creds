async function searchMovie() {
	try {
		// Get movie title from search bar
		const movieSearchInput = document.getElementById('movieSearch');
		const movieTitle = movieSearchInput.value;

		// Display the movie details in the #movieDetails div
		const movieDetailsContainer = document.getElementById('movieDetails');
		
		const movieIdInfo = await fetchMovieId(movieTitle);
		
		if (movieIdInfo.results.length == 0){
			let errorMsg = "Cannot find this movie";
			movieDetailsContainer.innerHTML = `
			<p>${errorMsg}</p>
			`;
			return;
		}
		
		const movieId = movieIdInfo.results[0].id;
		
		const postCredsInfo = await fetchMoviePostCreds(movieId);
		
		const postCreds = postCredsInfo.keywords.some(keyword => keyword.id === 179430);
		//const hasPostCreds = postCreds ? "Yes" : "No";
		let hasPostCreds;

		if(postCreds){
			hasPostCreds = "YES, there's a post credits scene, stick around!";
		}
		else{
			hasPostCreds = "NO post credits scene, feel free to leave!";
		}
		
		movieDetailsContainer.innerHTML = `
			<p>${hasPostCreds}</p>
			`;
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
    movieSearchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            searchMovie();
        }
    });
});

var bearer_token = config.BEARER_TOKEN;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: bearer_token
  }
};