<script lang="ts">
	import Tracklist from './tracklist.svelte';
	import { playlist } from '$lib/utils/user-state.svelte';
	import { goto } from '$app/navigation';

	let { userId } = $props();

	const playlistTracks = $derived(playlist.getPlaylist());

	const onclick = async () => {
		if (!userId) {
			goto('/api/login');
		}
		// const response = await fetch('/api/save', {
		// 	method: 'POST',
		// 	body: JSON.stringify({ playlist: playlistTracks })
		// });
		// const data = await response.json();
		// console.log(data);
	};
</script>

<div
	class="flex flex-col justify-between gap-2 rounded-xl border border-purple-800 bg-purple-950 p-4"
>
	<div class="flex flex-col gap-2">
		<p class="text-xs text-purple-300 uppercase">Playlist Name</p>
		<h2 class="text-white">Playlist</h2>
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
