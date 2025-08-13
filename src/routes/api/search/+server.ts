import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { spotify } from '$lib/utils/spotify.svelte';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('query');

	if (!query) {
		return json({ error: 'Missing query parameter' }, { status: 400 });
	}

	const data = await spotify.searchTracks(query);
	return json(data);
};
