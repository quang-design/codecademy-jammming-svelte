<script lang="ts">
	import TrackList from './tracklist.svelte';
	import { searchResult } from '$lib/spotify/spotify.svelte';
</script>

<div class="rounded-xl border border-purple-800 bg-purple-950 p-4">
	<h2 class="mb-2">Results</h2>
	{#if searchResult.getSearchResult().length > 0}
		<TrackList tracks={searchResult.getSearchResult()} />
	{:else}
		<p class="text-purple-200">No results found</p>
	{/if}
</div>
