import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { spotify } from '$lib/utils/spotify.svelte';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const playlist = body.playlist;
	spotify.saveToPlaylist(playlist);
	return json({ playlist });
};
