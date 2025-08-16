<script lang="ts">
	import Tracklist from './tracklist.svelte';
	import { playlist } from '$lib/utils/user-state.svelte';
	import { onMount } from 'svelte';

	import type { TrackProps } from '$lib/utils/user-state.svelte';

	let playlistName = $state('Playlist');
	let isRenaming = $state(false);

	let playlistTracks = $derived(playlist.getPlaylist());

	const toggleRename = () => {
		isRenaming = !isRenaming;
		localStorage.setItem('playlistName', playlistName);
	};

	const onclick = async () => {
		const response = await fetch('/api/save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				playlistName,
				tracks: playlistTracks.map((t) => t.id)
			})
		});

		if (response.status === 401) {
			// Not authenticated with Spotify yet
			window.location.href = '/api/login';
			return;
		}

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			alert(err.error ?? 'Failed to save playlist');
			return;
		}

		const { snapshotId } = await response.json();

		if (snapshotId) {
			console.log(snapshotId);
			alert('Playlist saved successfully');
			localStorage.removeItem('playlist');
			localStorage.removeItem('playlistName');
		}
	};

	onMount(() => {
		const localTracks = JSON.parse(localStorage.getItem('playlist') || '[]');
		localTracks.forEach((track: TrackProps) => playlist.addTrack(track));
		const localName = localStorage.getItem('playlistName') || 'Playlist';
		playlistName = localName;
	});
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
