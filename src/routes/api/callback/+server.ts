import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');

	// console.log(code, error);

	if (error) {
		return new Response(error, { status: 400 });
	}

	if (!code) {
		return new Response('No code', { status: 400 });
	}

	const codeVerifier = cookies.get('code_verifier');
	if (!codeVerifier) {
		return new Response('No code verifier', { status: 400 });
	}

	try {
		const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: PUBLIC_SPOTIFY_REDIRECT_URI,
				client_id: PUBLIC_SPOTIFY_CLIENT_ID,
				code_verifier: codeVerifier
			})
		});

		const tokenData = await tokenResponse.json();
		if (!tokenResponse.ok) {
			console.error('Token exchange failed:', tokenData);
			return new Response('Token exchange failed', { status: 400 });
		}

		const { access_token, refresh_token, expires_in } = tokenData;

		// Persist tokens in httpOnly cookies
		cookies.set('spotify_access_token', access_token, {
			httpOnly: true,
			secure: !dev,
			maxAge: expires_in ?? 3600,
			path: '/',
			sameSite: 'lax'
		});

		if (refresh_token) {
			cookies.set('spotify_refresh_token', refresh_token, {
				httpOnly: true,
				secure: !dev,
				maxAge: 30 * 24 * 60 * 60, // 30 days
				path: '/',
				sameSite: 'lax'
			});
		}

		// Try to fetch the current user's profile to store the user_id for later API calls
		try {
			const meRes = await fetch('https://api.spotify.com/v1/me', {
				headers: { Authorization: `Bearer ${access_token}` }
			});
			if (meRes.ok) {
				const me = await meRes.json();
				if (me?.id) {
					cookies.set('user_id', me.id, {
						httpOnly: true,
						secure: !dev,
						maxAge: 30 * 24 * 60 * 60,
						path: '/',
						sameSite: 'lax'
					});
				}
			} else {
				console.warn('Failed to fetch Spotify user profile:', await meRes.text());
			}
		} catch (e) {
			console.warn('Error fetching Spotify user profile:', e);
		}

		// Clear code verifier cookie
		cookies.delete('code_verifier', { path: '/' });
	} catch (error) {
		console.error('Error getting Spotify access token:', error);
		return new Response('Internal Server Error', { status: 500 });
	}

	// Redirect home
	throw redirect(303, '/');
};
