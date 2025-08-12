import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '$env/static/private';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	// code verifier
	const generateRandomString = (length: number) => {
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce((acc, x) => acc + possible[x % possible.length], '');
	};

	const codeVerifier = generateRandomString(64);

	// code challenge
	const sha256 = async (plain: string) => {
		const encoder = new TextEncoder();
		const data = encoder.encode(plain);
		return crypto.subtle.digest('SHA-256', data);
	};

	const base64encode = (input: ArrayBuffer) => {
		return btoa(String.fromCharCode(...new Uint8Array(input)))
			.replace(/=/g, '')
			.replace(/\+/g, '-')
			.replace(/\//g, '_');
	};

	const hashed = await sha256(codeVerifier);
	const codeChallenge = base64encode(hashed);

	// request user authorization
	const scope =
		'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';
	const authUrl = new URL('https://accounts.spotify.com/authorize');

	cookies.set('code_verifier', codeVerifier, {
		path: '/'
	});

	const params = {
		response_type: 'code',
		client_id: SPOTIFY_CLIENT_ID,
		scope,
		code_challenge_method: 'S256',
		code_challenge: codeChallenge,
		redirect_uri: SPOTIFY_REDIRECT_URI
	};

	authUrl.search = new URLSearchParams(params).toString();

	return redirect(302, authUrl.toString());
};
