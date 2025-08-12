export interface TrackProps {
	id: string;
	name: string;
	artist: string;
	cover: string;
	href: string;
}

class Playlist {
	#playlist: TrackProps[] = $state([
		{
			id: '1',
			name: 'Track 1',
			artist: 'Artist 1',
			cover: 'cover.jpg',
			href: '/track/1'
		}
	]);

	getPlaylist() {
		return this.#playlist;
	}

	addTrack(track: TrackProps) {
		this.#playlist.push(track);
	}

	removeTrack(track: TrackProps) {
		this.#playlist = this.#playlist.filter((t) => t.id !== track.id);
	}
}

export const playlist = new Playlist();

class SearchResult {
	#searchResult: TrackProps[] = $state([
		{
			id: '2',
			name: 'Track 2',
			artist: 'Artist 2',
			cover: 'cover.jpg',
			href: '/track/2'
		},
		{
			id: '3',
			name: 'Track 3',
			artist: 'Artist 3',
			cover: 'cover.jpg',
			href: '/track/3'
		},
		{
			id: '4',
			name: 'Track 4',
			artist: 'Artist 4',
			cover: 'cover.jpg',
			href: '/track/4'
		},
		{
			id: '5',
			name: 'Track 5',
			artist: 'Artist 5',
			cover: 'cover.jpg',
			href: '/track/5'
		}
	]);

	getSearchResult() {
		return this.#searchResult;
	}

	updateSearchResult(tracks: TrackProps[]) {
		this.#searchResult = tracks;
	}

	removeTrack(track: TrackProps) {
		this.#searchResult = this.#searchResult.filter((t) => t.id !== track.id);
	}
}

export const searchResult = new SearchResult();
