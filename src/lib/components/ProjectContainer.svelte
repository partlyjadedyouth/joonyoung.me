<script lang="ts">
	export let id: string;
	export let year: string;
	export let title: string;
	export let description: string;
	export let thumbnail: string;
	export let tags: string[] = [];
</script>

<!-- Project container -->
<a href={`/projects/${id}`}>
	<div
		class="font-ibm container border-gray-400 hover:border-gray-700 border rounded-lg my-4 px-4 py-5 min-h-40 flex items-center justify-between"
	>
		<!-- Project description -->
		<div class="flex flex-col max-w-sm">
			<p class="font-regular text-lg mb-1">{title}</p>
			<p class="font-light text-sm">{description}</p>

			<div class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
				<p class="font-thin">{year}</p>
				{#if tags.length > 0}
					<div class="flex flex-wrap gap-x-1.5 gap-y-1">
						{#each tags as tag}
							<span class="border rounded-lg border-black px-2 font-regular">
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<!-- Project thumbnail -->
		<div class="w-36 border border-gray-400 hidden sm:block">
			<img alt={title} src={thumbnail} class="object-contain" />
		</div>
	</div>
</a>
