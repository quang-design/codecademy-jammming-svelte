<script lang="ts">
	import Tracklist from './tracklist.svelte';
	import { playlist } from '$lib/utils/user-state.svelte';
	import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } from '$env/static/public';
	import { goto } from '$app/navigation';

	let playlistName = $state('Playlist');
	let isRenaming = $state(false);

	const playlistTracks = $derived(playlist.getPlaylist());

	const toggleRename = () => {
		isRenaming = !isRenaming;
	};

	const onclick = async () => {
		console.log('save to playlist');

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

		localStorage.setItem('code_verifier', codeVerifier);

		const scope =
			'user-read-private user-read-email playlist-modify-public playlist-modify-private';

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
		return (window.location.href = authUrl.toString());
	};
</script>

<div
	class="flex flex-col justify-between gap-2 rounded-xl border border-purple-800 bg-purple-950 p-4"
>
	<div class="flex flex-col gap-2">
		<p class="text-xs text-purple-300 uppercase">Playlist Name</p>

		<div class="flex items-center justify-between gap-2">
			{#if isRenaming}
				<h2
					class="w-full border-b border-purple-600 text-white"
					bind:textContent={playlistName}
					contenteditable="true"
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							toggleRename();
						}
					}}
				>
					{playlistName}
				</h2>
				{@render renameButton('Done', toggleRename)}
			{:else}
				<h2 class="text-white" bind:textContent={playlistName} contenteditable="false">
					{playlistName}
				</h2>
				{@render renameButton('Rename', toggleRename)}
			{/if}
		</div>

		{#if playlistTracks.length > 0}
			<Tracklist tracks={playlistTracks} isPlaylist={true} />
		{:else}
			<p class="text-purple-200">No tracks found</p>
		{/if}
	</div>
	<button
		class="rounded-full border border-purple-600 bg-purple-900 p-4 text-white transition-all duration-150 hover:bg-purple-800 active:scale-99 disabled:opacity-50"
		{onclick}
		disabled={playlistTracks.length === 0}
	>
		Save to Playlist
	</button>
</div>

{#snippet renameButton(text: string, onclick: () => void)}
	<button
		{onclick}
		class="cursor-pointer text-purple-200/75 underline decoration-[0.5px] underline-offset-3 hover:text-purple-200"
	>
		{text}
	</button>
{/snippet}
