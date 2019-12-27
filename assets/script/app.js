/*
 * Music app
 *
 */

// DOM queries
const searchForm = document.querySelector('#search-form');

// Class instances
const musicSearch = new MusicSearch();
const updateUI = new MusicUI();

// Hande search result
const handleSearchResults = searchResults => {
	const { artists = false, albums = false, tracks = false } = searchResults;

	// If results contains artists
	if (artists && artists.total) {
		updateUI.createHeader('Artists');
		updateUI.createList('artists');
		artists.data.forEach(artist => updateUI.renderArtist(artist));
	}
	// If results contains albums
	if (albums && albums.total) {
		updateUI.createHeader('Albums');
		updateUI.createList('albums');
		albums.data.forEach(album => updateUI.renderAlbum(album));
	}
	// If results contains tracks
	if (tracks && tracks.total) {
		updateUI.createHeader('Tracks');
		updateUI.createList('tracks');
		tracks.data.forEach(track => updateUI.renderTrack(track));
	}

	// If no results to show
	if (!(artists.total || albums.total || tracks.total)) {
		document.querySelector('main').innerText = 'Nothing to display';
	}
};

// Search for music when form has been submitted
searchForm.addEventListener('submit', e => {
	// Prevent default action
	e.preventDefault();

	// Get search value from input field
	const search = searchForm.search.value.trim().toLowerCase();
	localStorage.setItem('search', search);

	// Reset page
	searchForm.reset();
	updateUI.clear();

	// Search based on user input and handle results
	musicSearch
		.complete(search)
		.then(handleSearchResults)
		.catch(updateUI.renderError);
});

// Listen for click events and handle it
document.querySelector('main').addEventListener('click', async e => {
	// Prevent default action
	e.preventDefault();

	// Return if clicked element or parent element is not an a-tag
	if (!(e.target.tagName === 'A' || e.target.parentElement.tagName === 'A')) {
		return;
	}

	// Clear content element
	updateUI.clear();

	// Check if element has data attribute 'search'
	if (e.target.dataset.showAll) {
		const search = localStorage.getItem('search');
		const type = e.target.dataset.showAll;

		// Get all search results based on type
		switch (type) {
			case 'artists':
				musicSearch
					.artists(search)
					.then(res => handleSearchResults({ artists: res }))
					.catch(updateUI.renderError);
				break;
			case 'albums':
				musicSearch
					.albums(search)
					.then(res => handleSearchResults({ albums: res }))
					.catch(updateUI.renderError);
				break;
			case 'tracks':
				musicSearch
					.tracks(search)
					.then(res => handleSearchResults({ tracks: res }))
					.catch(updateUI.renderError);
				break;
		}
	}

	// Check if element has data attribute 'artist'
	if (e.target.dataset.artist) {
		// Get artist info and render to page
		musicSearch
			.artistInfo(e.target.dataset.artist)
			.then(updateUI.renderArtistInfo)
			.catch(updateUI.renderError);
	}

	// Check if element has data attribute 'album'
	if (e.target.dataset.album) {
		// Get album info and render to page
		musicSearch
			.albumInfo(e.target.dataset.album)
			.then(updateUI.renderAlbumInfo)
			.catch(updateUI.renderError);
	}
});
