export interface TrackProps {
	id: string;
	name: string;
	artist: string;
	cover: string;
	href: string;
}

class Playlist {
	#playlist: TrackProps[] = $state([]);

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
	#searchResult: TrackProps[] = $state([]);

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
