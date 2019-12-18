/*
 * Music app
 *
 */
const searchForm = document.querySelector('#search-form');
const searchResultEL = document.querySelector('#search-result');
const checkBoxes = searchForm.querySelectorAll('.form-check-input');
let searchFilter = [];

const filterTracks = (searchResult, search) => {
	return searchResult.filter(track => track.title.toLowerCase().includes(search));
};

const renderTracks = (tracks, search) => {
	const ulListEl = document.createElement('ul');
	ulListEl.className = 'list-group';
	searchResultEL.innerHTML = `<h1 class="h5 text-center">Show results for <strong>"${search}"</strong></h1>`;

	if (!tracks.length) {
		searchResultEL.innerHTML += 'Nothing to display.';
		return;
	}

	tracks.forEach(track => {
		let duration = moment.unix(track.duration).format('m:ss');
		console.log(duration);
		ulListEl.innerHTML += `
			<li class="list-group-item list-group-item-dark">
				<img src="${track.album.cover}"
					class="mr-3 cover-img" alt="">
				<div>
					<p class="mb-0 font-weight-bold"><a href="#">${track.title}</a> <span class="pl-1 text-muted font-weight-light">${duration}</span></p>
					<p class="mb-0">by <a href="#">${track.artist.name}</a></p>
					<p class="text-muted mb-0">${track.album.title}</p>
				</div>
			</li>`;
	});

	searchResultEL.append(ulListEl);
};

// Fetch data based on search input
const getSearchResults = async search => {
	const response = await fetch(
		`https://deezerdevs-deezer.p.rapidapi.com/search?q=${search}`,
		{
			method: 'GET',
			headers: {
				'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
				'x-rapidapi-key':
					'2a11b8c9e4mshdfa99e565a87ecbp1abf0ejsn25d0e8acdf15'
			}
		}
	);

	if (!response.ok) {
		throw new Error('Response was not ok.');
	}

	return await response.json();
};

const updateUI = (searchResults, search) => {
	if (searchFilter.includes('track')) {
		const tracks = filterTracks(searchResults.data, search);
		renderTracks(tracks, search);
	}
	if (searchFilter.includes('album')) {
		console.log('show albums');
	}
	if (searchFilter.includes('artist')) {
		console.log('show artists');
	}
};

searchForm.addEventListener('submit', e => {
	// Prevent default action
	e.preventDefault();

	// Get search and filter value
	const search = searchForm.search.value.trim().toLowerCase();
	searchFilter = Array.from(checkBoxes)
		.filter(checkBox => checkBox.checked)
		.map(checkBox => checkBox.value);

	// Get search results
	getSearchResults(search)
		.then(searchResult => updateUI(searchResult, search))
		.catch(err => {
			console.log(err);
		});

	// Reset form
	searchForm.reset();
});
