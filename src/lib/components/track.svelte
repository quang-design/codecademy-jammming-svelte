<script lang="ts">
	import type { TrackProps } from '$lib/spotify/spotify.svelte';
	import { playlist, searchResult } from '$lib/spotify/spotify.svelte';

	let { track, isPlaylist }: { track: TrackProps; isPlaylist?: boolean } = $props();

	const onadd = (track: TrackProps) => {
		playlist.addTrack(track);
		searchResult.removeTrack(track);
	};

	const onremove = (track: TrackProps) => {
		playlist.removeTrack(track);
	};
</script>

<div class="flex justify-between gap-2 rounded-lg border border-purple-800 bg-purple-950 p-2">
	<div class="flex gap-2">
		<img src={track.cover} alt="" class="size-12 rounded-lg bg-purple-800" />

		<div class="flex flex-col">
			<p class="font-semibold">{track.name}</p>
			<p class="text-purple-200">{track.artist}</p>
		</div>
	</div>

	<div class="flex gap-2">
		{#if !isPlaylist}
			<button
				type="button"
				class="size-10 cursor-pointer justify-center rounded-full border border-purple-600 bg-purple-900 text-white hover:bg-purple-800"
				onclick={() => onadd(track)}
			>
				+
			</button>
		{:else}
			<button
				type="button"
				class="size-10 cursor-pointer justify-center rounded-full border border-purple-600 bg-purple-900 text-white hover:bg-purple-800"
				onclick={() => onremove(track)}
			>
				-
			</button>
		{/if}
	</div>
</div>
