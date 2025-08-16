<script lang="ts">
	import Tracklist from './tracklist.svelte';
	import { playlist } from '$lib/utils/user-state.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let playlistName = $state('Playlist');
	let isRenaming = $state(false);
	let user_id: string = $state('');

	let playlistTracks = $derived(playlist.getPlaylist());

	const toggleRename = () => {
		isRenaming = !isRenaming;
		localStorage.setItem('playlistName', playlistName);
	};

	if (browser) {
		const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
		user_id = cookies.find((cookie) => cookie.startsWith('user_id='))?.split('=')[1] || '';
	}

	const onclick = async () => {
		if (!user_id) {
			goto('/api/login');
			return;
		}

		const response = await fetch('/api/save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: user_id,
				playlistName,
				tracks: playlistTracks
			})
		});

		const { snapshotId } = await response.json();

		if (snapshotId) {
			console.log(snapshotId);
			alert('Playlist saved successfully');
		}
	};

	onMount(() => {
		const localTracks = JSON.parse(localStorage.getItem('playlist') || '[]');
		const localName = localStorage.getItem('playlistName') || 'Playlist';
		playlistTracks = localTracks;
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
