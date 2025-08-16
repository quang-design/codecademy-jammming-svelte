import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import type { SearchContent, Track } from 'spotify-types';
import type { TrackProps } from './user-state.svelte';

class Spotify {
	private accessToken: string | null = $state('');
	private tokenExpirationTime: number | null = $state(0);

	private isTokenExpired() {
		if (!this.tokenExpirationTime) return true;
		return Date.now() > this.tokenExpirationTime;
	}

	public setAccessToken(accessToken: string, expires_in: number) {
		this.accessToken = accessToken;
		this.tokenExpirationTime = Date.now() + expires_in * 1000;
	}

	public async getRefreshToken() {
		const url = 'https://accounts.spotify.com/api/token';

		const payload = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: this.accessToken!,
				client_id: PUBLIC_SPOTIFY_CLIENT_ID,
				client_secret: SPOTIFY_CLIENT_SECRET
			})
		};

		const body = await fetch(url, payload);
		const response = await body.json();
		console.log(response);
		this.accessToken = response.access_token;
		this.tokenExpirationTime = Date.now() + response.expires_in * 1000;

		return response;
	}

	public async getAccessToken() {
		if (this.accessToken && !this.isTokenExpired()) {
			return this.accessToken;
		}
		const clientId = PUBLIC_SPOTIFY_CLIENT_ID;
		const clientSecret = SPOTIFY_CLIENT_SECRET;

		if (!clientId || !clientSecret) {
			throw new Error('Missing Spotify credentials');
		}

		try {
			const response = await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
			});

			const data: { access_token: string; expires_in: number } = await response.json();

			/** 
                {
                    access_token: 'BQC7CH_l3T6WkBuzDJdNDWIV22cfvIIepKjgGslxdZBDW7H7wIMGvAQD3U0PX-1qIIDpTbyRNtjmzN--AYUBJdsM9kCqsZDc7voqjxd53E2NIajPqdyAdnZu8LpNL1jaYEr9_sm0Cwg',
                    token_type: 'Bearer',
                    expires_in: 3600
                }
            */
			this.setAccessToken(data.access_token, data.expires_in);

			return this.accessToken;
		} catch (error) {
			console.error('Error getting Spotify access token:', error);
			throw error;
		}
	}

	public async searchTracks(query: string) {
		const accessToken = await this.getAccessToken();

		try {
			const response = await fetch(
				`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				}
			);

			const data: SearchContent = await response.json();

			const tracks: Track[] = data?.tracks?.items || [];

			const parsedTracks: TrackProps[] = tracks.map((track) => ({
				id: track.id,
				cover: track.album.images[0].url,
				name: track.name,
				artist: track.artists[0].name,
				href: track.external_urls.spotify
			}));

			return parsedTracks;
		} catch (error) {
			console.error('Error getting Spotify track:', error);
			throw error;
		}
	}
}

export const spotify = new Spotify();
