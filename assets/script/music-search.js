/*
 * Music app
 *
 */

class MusicSearch {
	constructor() {
		this.baseURL = 'https://deezerdevs-deezer.p.rapidapi.com/';
	}

	async getJSON(url) {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
				'x-rapidapi-key':
					'5860b531a7msh3bd92ef36bbb87ep17062bjsneba0c800c401'
			}
		});
		const res = await response.json();

		if (!response.ok || res.error) {
			throw new Error('Something went wrong. Try again later.');
		}

		return res;
	}

	// Get search results for artists
	async artists(search) {
		return await this.getJSON(this.baseURL + `search/artist?q=${search}`);
	}

	// Get search results for albums
	async albums(search) {
		return await this.getJSON(this.baseURL + `search/album?q=${search}`);
	}

	// Get search results for tracks
	async tracks(search) {
		return await this.getJSON(this.baseURL + `search/track?q=${search}`);
	}

	// Collect search results for artist, albums and tracks, limited to 5 items each
	async complete(search) {
		return {
			artists: await this.artists(`${search}&limit=5`),
			albums: await this.albums(`${search}&limit=5`),
			tracks: await this.tracks(`${search}&limit=5`)
		};
	}

	// Get all data related to specific artist
	async artistInfo(id) {
		const artist = await this.getJSON(this.baseURL + `artist/${id}`);
		const tracklist = await this.getJSON(
			this.baseURL + `artist/${id}/top?limit=5`
		);
		let albums = await this.getJSON(
			this.baseURL + `search/album?q=${artist.name}`
		);
		albums = albums.data.filter(album => album.artist.id == id);

		return { artist, tracklist, albums };
	}

	// Get all data related to specific album
	async albumInfo(id) {
		return await this.getJSON(this.baseURL + `/album/${id}`);
	}
}
