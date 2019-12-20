/*
 * Music app
 *
 */
const searchForm = document.querySelector('#search-form');
const searchResultEL = document.querySelector('#search-result-wrapper');
const albumsEl = document.querySelector('#search-albums');
const artistsEl = document.querySelector('#search-artists');
const tracksEl = document.querySelector('#search-tracks');

// Fetch data based on query-string
const getData = async url => {
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
			'x-rapidapi-key': '5860b531a7msh3bd92ef36bbb87ep17062bjsneba0c800c401'
		}
	});

	if (!response.ok) {
		throw new Error('Response was not ok.');
	}

	return await response.json();
};

// Get search results for artists
const searchArtists = async (search, limit = '') => {
	return await getData(
		`https://deezerdevs-deezer.p.rapidapi.com/search/artist?q=${search}${limit}`
	);
};

// Get search results for albums
const searchAlbums = async (search, limit = '') => {
	return await getData(
		`https://deezerdevs-deezer.p.rapidapi.com/search/album?q=${search}${limit}`
	);
};

// Get search results for tracks
const searchTracks = async (search, limit = '') => {
	return await getData(
		`https://deezerdevs-deezer.p.rapidapi.com/search/track?q=${search}${limit}`
	);
};

// Collect search results for artist, albums and tracks, limited to 5 items each
const searchAll = async search => {
	return {
		artists: await searchArtists(search, '&limit=5'),
		albums: await searchAlbums(search, '&limit=5'),
		tracks: await searchTracks(search, '&limit=5')
	};
};

// Add search value to data-attribute
const saveSearch = search => {
	searchResultEL
		.querySelectorAll('header a')
		.forEach(a => a.setAttribute('data-search', search));
};

// Get all data related to specific artist
const getArtistInfo = async id => {
	const artist = await getData(
		`https://deezerdevs-deezer.p.rapidapi.com/artist/${id}`
	);
	const tracklist = await getData(
		`https://deezerdevs-deezer.p.rapidapi.com/artist/${id}/top?limit=5`
	);
	let albums = await getData(
		`https://deezerdevs-deezer.p.rapidapi.com/search/album?q=${artist.name}`
	);
	albums = albums.data.filter(album => album.artist.id == id);

	return { artist, tracklist, albums };
};

// Get all data related to specific album
const getAlbumInfo = async id => {
	return await getData(`https://deezerdevs-deezer.p.rapidapi.com/album/${id}`);
};

// Render all artists related to search result
const renderArtistResult = artist => {
	artistsEl.querySelector('ul').innerHTML += `
		<li class="list-group-item list-group-item-dark">
			<img src="${artist.picture_medium}"
				class="mr-3 cover-img" alt="">
			<div>
				<p class="mb-0"><a href="#" data-artist="${artist.id}">${artist.name}</a></p>
				<p class="text-muted mb-0">Artist</a></p>
			</div>
		</li>`;
};

// Render all albums related to search result
const renderAlbumResult = album => {
	albumsEl.querySelector('ul').innerHTML += `
		<li class="list-group-item list-group-item-dark">
			<img src="${album.cover_medium}"
				class="mr-3 cover-img" alt="">
			<div>
				<p class="mb-0"><a href="#" data-album="${album.id}">${album.title}</a></p>
				<p class="text-muted mb-0"><a href="#" data-artist="${album.artist.id}">${album.artist.name}</a></p>
			</div>
		</li>`;
};

// Render all tracks related to search result
const renderTrackResult = track => {
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
};

// Render tracklist used for artist & album info
const renderTrackList = (tracks, el) => {
	// Clear list
	el.querySelector('ul').innerHTML = '';

	// Add tracks to list
	tracks.forEach((track, i) => {
		let duration = moment.unix(track.duration).format('m:ss');
		el.querySelector('ul').innerHTML += `
			<li class="list-group-item list-group-item-dark list-group-item-small">
			<p class="mb-0"><span class="mr-2">${i + 1}.</span> ${track.title}</p>
			<p class="mb-0 text-muted">${duration}<i class="far fa-play-circle ml-4 text-white"></i></p>
			</li>`;
	});
};

// Render album list
const renderAlbumList = (albums, el) => {
	albums.forEach(album => {
		el.querySelector('#discography').innerHTML += `
			<div>
				<a href="#" data-album="${album.id}">
				<img src="${album.cover_big}" data-album="${album.id}">
				</a>
			</div>`;
	});
};

// Render album info to page
const renderAlbumInfo = album => {
	const { artist, genres, tracks } = album;
	const albumEl = document.querySelector('#album');
	albumEl.querySelector('img').src = album.cover_big;
	albumEl.querySelector('#album-by').innerText = artist.name;
	albumEl.querySelector('#album-by').setAttribute('data-artist', artist.id);
	albumEl.querySelector('#album-released').innerText = album.release_date;
	albumEl.querySelector('#album-title').innerText = album.title;
	albumEl.querySelector('#album-genres').innerText = genres.data
		.map(genre => genre.name)
		.join(', ');

	renderTrackList(tracks.data, albumEl);

	// Display element
	albumEl.classList.remove('d-none');
};

// Render artist info to page
const renderArtistInfo = ({ artist, tracklist, albums }) => {
	const artistEl = document.querySelector('#artist');
	artistEl.querySelector('img').src = artist.picture_xl;
	artistEl.querySelector('#fans').innerText = `${artist.nb_fan} fans`;
	artistEl.querySelector('h1').innerText = artist.name;
	artistEl.querySelector('#discography').innerHTML = '';

	renderTrackList(tracklist.data, artistEl);
	renderAlbumList(albums, artistEl);

	// Display element
	artistEl.classList.remove('d-none');
};

// Clear HTML elements
const clearInfo = element => {
	const elements = document.querySelectorAll(element);
	elements.forEach(el => {
		el.innerHTML = '';
		if (el.tagName === 'IMG') el.src = '';
	});
};

// Add 'display none' to all section elements
const hideElements = () => {
	document
		.querySelectorAll('section')
		.forEach(section => section.classList.add('d-none'));
};

const handleSearchResults = searchResults => {
	const { artists = false, albums = false, tracks = false } = searchResults;

	if (artists) {
		artistsEl.querySelector('ul').innerHTML = '';
		artistsEl.classList.remove('d-none');
		artists.data.forEach(artist => renderArtistResult(artist));
	}
	if (albums) {
		albumsEl.querySelector('ul').innerHTML = '';
		albumsEl.classList.remove('d-none');
		albums.data.forEach(album => renderAlbumResult(album));
	}
	if (tracks) {
		tracksEl.querySelector('ul').innerHTML = '';
		tracksEl.classList.remove('d-none');
		tracks.data.forEach(track => renderTrackResult(track));
	}
};

searchForm.addEventListener('submit', e => {
	// Prevent default action
	e.preventDefault();

	// Get search value
	const search = searchForm.search.value.trim().toLowerCase();
	saveSearch(search);

	// Reset page
	searchForm.reset();
	hideElements();

	// Search based on user input and handle results
	searchAll(search)
		.then(handleSearchResults)
		.catch(err => console.log(err));
});

document.querySelector('main').addEventListener('click', async e => {
	// Prevent default action
	e.preventDefault();

	if (!(e.target.tagName === 'A' || e.target.parentElement.tagName === 'A')) {
		return;
	}

	// Add 'display none' to all section elements
	hideElements();

	// Check if element has data attribute 'search'
	if (e.target.dataset.search) {
		const search = e.target.dataset.search;
		const type = e.target.dataset.type;

		// Get all search results based on type
		switch (type) {
			case 'artist':
				searchArtists(search)
					.then(res => handleSearchResults({ artists: res }))
					.catch(err => console.log(err));
				break;
			case 'album':
				searchAlbums(search)
					.then(res => handleSearchResults({ albums: res }))
					.catch(err => console.log(err));
				break;
			case 'track':
				searchTracks(search)
					.then(res => handleSearchResults({ tracks: res }))
					.catch(err => console.log(err));
				break;
		}
	}

	// Check if element has data attribute 'artist'
	if (e.target.dataset.artist) {
		// Remove previous info
		clearInfo('.artist-info');

		// Get artist info and render to page
		getArtistInfo(e.target.dataset.artist)
			.then(renderArtistInfo)
			.catch(err => console.log(err));
	}

	// Check if element has data attribute 'album'
	if (e.target.dataset.album) {
		// Remove previous info
		clearInfo('.album-info');

		// Get album info and render to page
		getAlbumInfo(e.target.dataset.album)
			.then(renderAlbumInfo)
			.catch(err => console.log(err));
	}
});
