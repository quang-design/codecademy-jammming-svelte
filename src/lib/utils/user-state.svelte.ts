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

// const mockTracks: TrackProps[] = [
// 	{
// 		id: '72gPDy1zVt95zVNali0IhK',
// 		cover: 'https://i.scdn.co/image/ab67616d0000b273c0fd19def5108123e077d634',
// 		name: 'MEOW',
// 		artist: 'MEOVV',
// 		href: 'https://open.spotify.com/track/72gPDy1zVt95zVNali0IhK'
// 	},
// 	{
// 		id: '60r7bteIELWhpNifE9FkRM',
// 		cover: 'https://i.scdn.co/image/ab67616d0000b2735341e96c37dfa7a3620178b7',
// 		name: 'Meow',
// 		artist: 'lvusm',
// 		href: 'https://open.spotify.com/track/60r7bteIELWhpNifE9FkRM'
// 	},
// 	{
// 		id: '1ATuiXxtRPEBtSa7VAlc6X',
// 		cover: 'https://i.scdn.co/image/ab6742d3000053b7e1d4c61cce77f29e1809df95',
// 		name: 'Meow Mama',
// 		artist: 'Tito Lizzardo & Catty B',
// 		href: 'https://open.spotify.com/track/1ATuiXxtRPEBtSa7VAlc6X'
// 	},
// 	{
// 		id: '1aFi6Qx3dlyc7bCf9Cd7H7',
// 		cover: 'https://i.scdn.co/image/ab67616d0000b273f565236138ce4019fc1aa5ac',
// 		name: 'What Was I Made For? - Sad Cat Version',
// 		artist: 'Miau Miaw',
// 		href: 'https://open.spotify.com/track/1aFi6Qx3dlyc7bCf9Cd7H7'
// 	},
// 	{
// 		id: '2ZhGS0EfditvFMaPLbxCby',
// 		cover: 'https://i.scdn.co/image/ab67616d0000b2739b9b5803a36930784f050228',
// 		name: 'Meow Meow !',
// 		artist: 'CLOUDEE',
// 		href: 'https://open.spotify.com/track/2ZhGS0EfditvFMaPLbxCby'
// 	},
// 	{
// 		id: '2oKaAQtHtm7XBmwGBNolId',
// 		cover: 'https://i.scdn.co/image/ab6742d3000053b79572400d5811a0f2aed60cc7',
// 		name: 'Meow Meow Billee',
// 		artist: 'Nani & Babu',
// 		href: 'https://open.spotify.com/track/2oKaAQtHtm7XBmwGBNolId'
// 	},
// 	{
// 		id: '2nopDUxom21JoMzFXj9wS0',
// 		cover: 'https://i.scdn.co/image/ab67616d0000b273dda097a10d432db726d6f283',
// 		name: 'HANDS UP',
// 		artist: 'MEOVV',
// 		href: 'https://open.spotify.com/track/2nopDUxom21JoMzFXj9wS0'
// 	},
// 	{
// 		id: '42CUBAvLt9Q91XpRrtGasN',
// 		cover: 'https://i.scdn.co/image/ab67616d0000b27337dd6c7a5f996d15ebaa9268',
// 		name: 'meowsic',
// 		artist: 'd2s1',
// 		href: 'https://open.spotify.com/track/42CUBAvLt9Q91XpRrtGasN'
// 	},
// 	{
// 		id: '2cMamRoY1zObsJzM9RbatP',
// 		cover: 'https://i.scdn.co/image/ab6742d3000053b7b69ed5ce48dc2e6528e23ac5',
// 		name: 'Meow Meow Bhaucha',
// 		artist: 'Nani & Babu',
// 		href: 'https://open.spotify.com/track/2cMamRoY1zObsJzM9RbatP'
// 	},
// 	{
// 		id: '5fr7VBuNTiXAq4rH1e3v3q',
// 		cover: 'https://i.scdn.co/image/ab67616d0000b273f7f925f54f91e7772ceea291',
// 		name: 'OIIA OIIA (Spinning Cat)',
// 		artist: 'W&W',
// 		href: 'https://open.spotify.com/track/5fr7VBuNTiXAq4rH1e3v3q'
// 	}
// ];

class SearchResult {
	// #searchResult: TrackProps[] = $state(mockTracks);
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
