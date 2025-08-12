import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('query');

	const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${SPOTIFY_CLIENT_SECRET}`,
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return json(data);
};
