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
		artistsEl.innerHTML += 'Nothing to display.';
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

const renderArtist = (artist, tracklist, albums) => {
	const artistEl = document.querySelector('#artist');
	artistEl.querySelector('img').src = artist.picture_xl;
	artistEl.querySelector('#fans').innerText = `${artist.nb_fan} fans`;
	artistEl.querySelector('h1').innerText = artist.name;
	artistEl.querySelector('ul').innerHTML = '';
	artistEl.querySelector('#discography').innerHTML = '';

	tracklist.forEach((track, i) => {
		let duration = moment.unix(track.duration).format('m:ss');
		artistEl.querySelector('ul').innerHTML += `
			<li class="list-group-item list-group-item-dark list-group-item-small">
				<p class="mb-0"><span class="mr-2">${i + 1}.</span> ${track.title}</p>
				<p class="mb-0 text-muted">${duration}<i class="far fa-play-circle ml-4 text-white"></i></p>
			</li>`;
	});

	albums.forEach(album => {
		artistEl.querySelector('#discography').innerHTML += `
			<div>
				<a href="#" data-album="${album.id}">
				<img src="${album.cover_big}" data-album="${album.id}">
				</a>
			</div>`;
	});
	artistEl.classList.remove('d-none');
};

// Get all data related to specific artist
const getArtistInfo = async id => {
	const artist = await fetchData(`artist/${id}`);
	const tracklist = await fetchData(`artist/${id}/top?limit=5`);
	let albums = await fetchData(`search/album?q=${artist.name}`);
	albums = albums.data.filter(album => album.artist.name == artist.name);

	return { artist, tracklist, albums };
};

// Clear HTML elements
const clearInfo = element => {
	const elements = document.querySelectorAll(element);
	elements.forEach(el => {
		el.innerHTML = '';
		if (el.tagName === 'IMG') el.src = '';
	});
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

// Add search string to data-attribute
const saveSearch = search => {
	searchResultEL
		.querySelectorAll('header a')
		.forEach(a => a.setAttribute('data-search', search));
};

// Fetch data based on query-string
const fetchData = async query => {
	const response = await fetch(`https://api.deezer.com/${query}`);

	if (!response.ok) {
		throw new Error('Response was not ok.');
	}

	return await response.json();
};

const getAlbumInfo = async id => {
	return await fetchData(`album/${id}`);
};

const renderAlbum = album => {
	const { artist, genres, tracks } = album;
	const albumEl = document.querySelector('#album');
	albumEl.querySelector('ul').innerHTML = '';
	albumEl.querySelector('img').src = album.cover_big;
	albumEl.querySelector('#album-by').innerText = artist.name;
	albumEl.querySelector('a').setAttribute('data-artist', artist.id);
	albumEl.querySelector('#album-released').innerText = album.release_date;
	albumEl.querySelector('#album-title').innerText = album.title;
	albumEl.querySelector('#album-genres').innerText = genres.data
		.map(genre => genre.name)
		.join(', ');

	tracks.data.forEach((track, i) => {
		let duration = moment.unix(track.duration).format('m:ss');
		albumEl.querySelector('ul').innerHTML += `
			<li class="list-group-item list-group-item-dark list-group-item-small">
			<p class="mb-0"><span class="mr-2">${i + 1}.</span> ${track.title}</p>
			<p class="mb-0 text-muted">${duration}<i class="far fa-play-circle ml-4 text-white"></i></p>
			</li>`;
	});

	albumEl.classList.remove('d-none');
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
			searchResultEL.classList.remove('d-none');
		})
		.catch(err => {
			console.log(err);
		});

	// Reset form
	searchForm.reset();
	document.querySelector('#artist').classList.add('d-none');
	document.querySelector('#album').classList.add('d-none');
});

document.querySelector('main').addEventListener('click', async e => {
	e.preventDefault();

	if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
		searchResultEL.classList.add('d-none');
		document.querySelector('#artist').classList.add('d-none');
		document.querySelector('#album').classList.add('d-none');
	}

	// Get data related to selected artist
	if (e.target.dataset.artist) {
		getArtistInfo(e.target.dataset.artist)
			.then(({ artist, tracklist, albums }) => {
				clearInfo('.artist-info');
				renderArtist(artist, tracklist.data, albums);
			})
			.catch(err => console.log(err));
	}

	// Get data related to selected album
	if (e.target.dataset.album) {
		getAlbumInfo(e.target.dataset.album)
			.then(album => {
				clearInfo('.album-info');
				renderAlbum(album);
			})
			.catch(err => console.log(err));
	}
});
