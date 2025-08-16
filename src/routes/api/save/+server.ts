import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const playlist = body.playlist;
	const playlistName = body.playlistName;

	console.log(playlist, playlistName);

	return json({ playlist, playlistName });
};
