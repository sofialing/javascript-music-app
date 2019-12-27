/*
 * Music app
 *
 */
class MusicUI {
	constructor() {
		this.contentEl = document.querySelector('main');
	}

	// Clear content element
	clear = () => {
		this.contentEl.innerHTML = '';
	};

	// Create new header
	createHeader = str => {
		const header = document.createElement('header');
		const title = document.createElement('h2');
		const link = document.createElement('a');

		title.className = 'h6 font-weight-normal';
		title.innerText = str;
		link.innerText = 'Show all';
		link.href = '#';
		link.setAttribute('data-show-all', str.toLowerCase());

		header.append(title, link);
		this.contentEl.append(header);
	};

	// Create new list group
	createList = type => {
		const listGroup = document.createElement('ul');
		listGroup.className = `list-group list-group-${type} mb-4`;
		this.contentEl.append(listGroup);
	};

	// Render artists related to search result
	renderArtist = artist => {
		document.querySelector('.list-group-artists').innerHTML += `
			<li class="list-group-item list-group-item-dark">
				<img src="${artist.picture_medium}" class="mr-3 cover-img" alt="">
				<div>
					<p class="mb-0"><a href="#" data-artist="${artist.id}">${artist.name}</a></p>
					<p class="text-muted mb-0">Artist</a></p>
				</div>
			</li>`;
	};

	// Render albums related to search result
	renderAlbum = album => {
		document.querySelector('.list-group-albums').innerHTML += `
            <li class="list-group-item list-group-item-dark">
                <img src="${album.cover_medium}"class= "mr-3 cover-img" alt="">
                <div>
                    <p class="mb-0"><a href="#" data-album="${album.id}">${album.title}</a></p>
                    <p class="text-muted mb-0"><a href="#" data-artist="${album.artist.id}">${album.artist.name}</a></p>
                </div>
            </li>`;
	};

	// Render tracks related to search result
	renderTrack = track => {
		document.querySelector('.list-group-tracks').innerHTML += `
            <li class="list-group-item list-group-item-dark">
                <img src="${track.album.cover}" class="mr-3 cover-img" alt="">
                <div>
                    <p class="mb-0">${track.title}</p>
                    <p class="text-muted mb-0">
                        <a href="#" data-artist="${track.artist.id}">${track.artist.name}</a>,
                        <a href="#" data-album="${track.album.id}">${track.album.title}</a></p>
                </div>
            </li>`;
	};

	// Render list of tracks related to an artist or album
	renderTrackList = tracks => {
		tracks.forEach((track, i) => {
			let duration = moment.unix(track.duration).format('m:ss');
			document.querySelector('ul').innerHTML += `
		        <li class="list-group-item list-group-item-dark list-group-item-small">
					<p class="mb-0"><span class="mr-2">${i + 1}.</span> ${track.title}</p>
					<p class="mb-0 text-muted">${duration}<i class="far fa-play-circle ml-4 text-white"></i></p>
		        </li>`;
		});
	};

	// Render list of albums related to an artist
	renderAlbumList = albums => {
		albums.forEach(album => {
			document.querySelector('#discography').innerHTML += `
                <div>
                    <a href="#" data-album="${album.id}">
						<img src="${album.cover_big}" data-album="${album.id}">
                    </a>
                </div>`;
		});
	};

	// Render album info
	renderAlbumInfo = album => {
		const { artist, genres, tracks } = album;
		const html = `
			<img src="${album.cover_big}" class="mb-3">
			<div class="d-flex justify-content-between">
				<small class="text-uppercase">Album by 
					<a href="#" data-artist="${artist.id}">${artist.name}</a>
				</small>
			</div>
			<h1 class="mb-2 font-weight-bolder">${album.title}</h1>
			<small class="text-uppercase">Released ${album.release_date}.</small>
			<small class="text-uppercase">Genre: 
				${genres.data.map(genre => genre.name).join(', ')}.
			</small>
			<h2 class="h5 mt-4 mb-3">Tracks</h2>
			<ul class="list-group mb-4"></ul>`;

		this.contentEl.innerHTML = html;
		this.renderTrackList(tracks.data);
	};

	// Render artist info
	renderArtistInfo = ({ artist, tracklist, albums }) => {
		const html = `
			<img src="${artist.picture_xl}" class="mb-3">
			<div class="d-flex justify-content-between">
				<small class="text-uppercase">Artist</small>
				<small class="text-uppercase artist-info">${artist.nb_fan} fans</small>
			</div>
			<h1 class="mb-3 font-weight-bolder">${artist.name}</h1>
			<h2 class="h5 mb-3">Top tracks</h2>
			<ul class="list-group mb-4"></ul>
			<h2 class="h5 mb-3">Discography</h2>
			<div id="discography"></div>`;

		this.contentEl.innerHTML = html;
		this.renderTrackList(tracklist.data);
		this.renderAlbumList(albums);
	};

	renderError = err => {
		this.contentEl.innerHTML = `<div class="alert alert-danger">${err}</div>`;
	};
}
