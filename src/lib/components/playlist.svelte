<script lang="ts">
	import Tracklist from './tracklist.svelte';
	import { playlist } from '$lib/spotify/spotify.svelte';
</script>

<div class="flex flex-col gap-2 rounded-xl border border-purple-800 bg-purple-950 p-4">
	<p class="text-xs text-purple-300 uppercase">Playlist Name</p>
	<h2 class="text-white">Playlist</h2>
	{#if playlist.getPlaylist().length > 0}
		<Tracklist tracks={playlist.getPlaylist()} isPlaylist={true} />
	{:else}
		<p class="text-purple-200">No tracks found</p>
	{/if}
</div>
