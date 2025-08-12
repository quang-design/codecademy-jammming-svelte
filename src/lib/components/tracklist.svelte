<script lang="ts">
	import Track from './track.svelte';
	import type { TrackProps } from '$lib/spotify/mock.svelte';

	interface TracklistProps {
		tracks: TrackProps[];
		isPlaylist?: boolean;
	}

	let { tracks, isPlaylist }: TracklistProps = $props();
</script>

<div class="flex flex-col gap-2">
	{#each tracks as track (track.id)}
		<Track {track} {isPlaylist} />
	{/each}
</div>
