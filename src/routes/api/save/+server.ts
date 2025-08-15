import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { spotify } from '$lib/utils/spotify.svelte';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const playlist = body.playlist;
	const playlistName = body.playlistName;

	console.log(playlist, playlistName);

	const profile = await spotify.getCurrentUserProfile();
	const userId = profile.id;

	if (!userId) {
		return redirect(302, '/api/login');
	}

	console.log(userId);

	return json({ playlist, playlistName });
	// spotify.saveToPlaylist(playlist);
	// return json({ playlist });
};
