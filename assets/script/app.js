/*
 * Music app
 *
 */
const searchForm = document.querySelector('#search-form');

// Fetch data
const getData = async search => {
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
	const res = await response.json();
	console.log(res.data);
};

// Get input from search form
searchForm.addEventListener('submit', e => {
	e.preventDefault();
	const search = searchForm.search.value;

	// Reset form
	searchForm.reset();

	// Get data based on search
	getData(search);
});
