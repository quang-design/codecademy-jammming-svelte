<script lang="ts">
	import SearchBar from '$lib/components/search-bar.svelte';
	import Playlist from '$lib/components/playlist.svelte';
	import SearchResult from '$lib/components/search-result.svelte';

	let { userId } = $props();
</script>

<section class="container mx-auto flex max-w-2xl flex-col gap-4 p-8">
	<SearchBar />
</section>

<section class="grid grow grid-cols-1 gap-4 p-8 sm:grid-cols-2">
	<SearchResult />
	<Playlist {userId} />
</section>
