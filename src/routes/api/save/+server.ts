import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { spotify } from '$lib/utils/spotify.svelte';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const body = await request.json().catch(() => ({}));

		let tracks = body.tracks as unknown;
		const playlistName = String(body.playlistName ?? '').trim();

		if (!playlistName) {
			return json({ error: 'playlistName is required' }, { status: 400 });
		}

		// Normalize tracks to an array of track IDs (string[])
		if (Array.isArray(tracks)) {
			tracks = tracks
				.map((t) => (typeof t === 'string' ? t : (t?.id as string | undefined)))
				.filter((id): id is string => Boolean(id));
		} else {
			tracks = [] as string[];
		}

		if ((tracks as string[]).length === 0) {
			return json({ error: 'tracks must be a non-empty array of track IDs' }, { status: 400 });
		}

		const userId = cookies.get('user_id');
		const accessToken = cookies.get('spotify_access_token');
		if (!userId || !accessToken) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const playlistId = await spotify.createPlaylist(accessToken, userId, playlistName);
		const snapshotId = await spotify.addItemsToPlaylist(
			accessToken,
			playlistId,
			tracks as string[]
		);

		return json({ snapshotId });
	} catch (e) {
		console.error('Error saving playlist:', e);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
};
