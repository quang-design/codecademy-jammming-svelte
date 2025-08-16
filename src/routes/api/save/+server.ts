import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { spotify } from '$lib/utils/spotify.svelte';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const userId = body.userId;
	const tracks = body.tracks;
	const playlistName = body.playlistName;

	// console.log(userId, tracks, playlistName);

	const playlistId = await spotify.createPlaylist(userId, playlistName);
	const snapshotId = await spotify.addItemsToPlaylist(playlistId, tracks);

	return json({ snapshotId });
};
