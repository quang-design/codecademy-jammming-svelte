import { redirect, type RequestHandler } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } from '$env/static/public';

export const GET: RequestHandler = async ({ cookies }) => {
	const generateRandomString = (length: number) => {
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce((acc, x) => acc + possible[x % possible.length], '');
	};

	const codeVerifier = generateRandomString(64);

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

	cookies.set('code_verifier', codeVerifier, {
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		path: '/',
		maxAge: 600 // 10 minutes is plenty for the OAuth dance
	});

	const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';

	const authUrl = new URL('https://accounts.spotify.com/authorize');
	const params = {
		response_type: 'code',
		client_id: PUBLIC_SPOTIFY_CLIENT_ID,
		scope,
		code_challenge_method: 'S256',
		code_challenge: codeChallenge,
		redirect_uri: PUBLIC_SPOTIFY_REDIRECT_URI
	};
	authUrl.search = new URLSearchParams(params).toString();
	return redirect(302, authUrl.toString());
};
