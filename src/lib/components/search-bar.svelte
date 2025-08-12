<script lang="ts">
	let query = $state('');

	const onsubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		const response = await fetch(`/api/search?query=${query}`);
		const data = await response.json();
		console.log(data);
	};
</script>

<form action="#" class="flex flex-col gap-4" {onsubmit}>
	<input
		type="search"
		placeholder="Enter a song title"
		class="rounded-full border border-purple-400 bg-white/90 p-4 text-black"
		bind:value={query}
		minlength="3"
		required
	/>
	<button
		type="submit"
		class="cursor-pointer rounded-full border border-purple-400 bg-purple-900 p-4 text-white transition-all duration-150 hover:bg-purple-800 active:scale-99"
	>
		Search
	</button>
</form>
