/*
 * Music app
 *
 */
const searchForm = document.querySelector('#search-form');
const searchResultEL = document.querySelector('#search-result');
const albumsEl = document.querySelector('#albums');
const artistsEl = document.querySelector('#artists');
const tracksEl = document.querySelector('#tracks');

const renderAllArtists = artists => {
	artistsEl.classList.remove('d-none');
	artistsEl.querySelector('ul').innerHTML = '';

	if (!artists.length) {
		searchResultEL.innerHTML += 'Nothing to display.';
		return;
	}

	artists.forEach(artist => {
		artistsEl.querySelector('ul').innerHTML += `
			<li class="list-group-item list-group-item-dark">
				<img src="${artist.picture_medium}"
					class="mr-3 cover-img" alt="">
				<div>
					<p class="mb-0"><a href="#" data-artist="${artist.id}">${artist.name}</a></p>
					<p class="text-muted mb-0">Artist</a></p>
				</div>
			</li>`;
	});
};

const renderAllAlbums = albums => {
	albumsEl.classList.remove('d-none');
	albumsEl.querySelector('ul').innerHTML = '';

	if (!albums.length) {
		albumsEl.innerHTML += 'Nothing to display.';
		return;
	}

	albums.forEach(album => {
		albumsEl.querySelector('ul').innerHTML += `
			<li class="list-group-item list-group-item-dark">
				<img src="${album.cover_medium}"
					class="mr-3 cover-img" alt="">
				<div>
					<p class="mb-0"><a href="#" data-album="${album.id}">${album.title}</a></p>
					<p class="text-muted mb-0"><a href="#" data-artist="${album.artist.id}">${album.artist.name}</a></p>
				</div>
			</li>`;
	});
};

const renderAllTracks = tracks => {
	tracksEl.classList.remove('d-none');
	tracksEl.querySelector('ul').innerHTML = '';

	if (!tracks.length) {
		tracksEl.innerHTML += 'Nothing to display.';
		return;
	}

	tracks.forEach(track => {
		tracksEl.querySelector('ul').innerHTML += `
			<li class="list-group-item list-group-item-dark">
				<img src="${track.album.cover}"
					class="mr-3 cover-img" alt="">
				<div>
					<p class="mb-0">${track.title}</p>
					<p class="text-muted mb-0">
						<a href="#" data-artist="${track.artist.id}">${track.artist.name}</a>, 
						<a href="#" data-album="${track.album.id}">${track.album.title}</a></p>
				</div>
			</li>`;
	});
};

// Fetch data based on query-string
const fetchData = async query => {
	const response = await fetch(`https://api.deezer.com/${query}`);

	if (!response.ok) {
		throw new Error('Response was not ok.');
	}

	return await response.json();
};

// Get search results based on user input
const getSearchResults = async search => {
	const albums = await fetchData(`search/album?q=${search}&limit=5&order=ranking`);
	const artists = await fetchData(
		`search/artist?q=${search}&limit=5&order=ranking`
	);
	const tracks = await fetchData(`search/track?q=${search}&limit=5&order=ranking`);

	return { artists, albums, tracks };
};

const saveSearch = search => {
	searchResultEL
		.querySelectorAll('header a')
		.forEach(a => a.setAttribute('data-search', search));
};

searchForm.addEventListener('submit', e => {
	// Prevent default action
	e.preventDefault();

	// Get search value
	const search = searchForm.search.value.trim().toLowerCase();
	saveSearch(search);

	// Get search result and render to page
	getSearchResults(search)
		.then(({ artists, albums, tracks }) => {
			renderAllArtists(artists.data);
			renderAllAlbums(albums.data);
			renderAllTracks(tracks.data);
		})
		.catch(err => {
			console.log(err);
		});

	// Reset form
	searchForm.reset();
});
