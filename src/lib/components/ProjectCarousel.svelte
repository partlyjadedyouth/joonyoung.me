<script lang="ts">
	import { onMount } from 'svelte';
	import type { Project } from '$lib/utils/definitions';

	export let projects: Project[] = [];

	let carouselEl: HTMLDivElement | null = null;
	let canScrollPrevious = false;
	let canScrollNext = false;

	const updateScrollState = () => {
		if (!carouselEl) return;
		const maxScrollLeft = carouselEl.scrollWidth - carouselEl.clientWidth;
		canScrollPrevious = carouselEl.scrollLeft > 2;
		canScrollNext = carouselEl.scrollLeft < maxScrollLeft - 2;
	};

	const scrollCarousel = (direction: -1 | 1) => {
		carouselEl?.scrollBy({
			left: direction * 280,
			behavior: 'smooth'
		});
	};

	onMount(() => {
		carouselEl?.scrollTo({ left: 0 });
		updateScrollState();

		window.addEventListener('resize', updateScrollState);

		return () => {
			window.removeEventListener('resize', updateScrollState);
		};
	});
</script>

{#if projects.length > 0}
	<div class="relative mt-5 w-full font-ibm">
		<div
			class="carousel-track flex gap-4 overflow-x-auto pb-1"
			bind:this={carouselEl}
			on:scroll={updateScrollState}
		>
			{#each projects as project (project.id)}
				<article
					class="w-[15.5rem] flex-none rounded-lg border border-gray-400 bg-white transition-colors hover:border-gray-800"
				>
					<a href={`/projects/${project.id}`} class="block border-b border-gray-300">
						<img
							alt={project.title}
							src={project.thumbnail}
							class="aspect-[4/3] w-full object-cover rounded-t-lg"
						/>
					</a>

					<div class="flex flex-1 flex-col p-4">
						<div class="flex flex-col items-start justify-between gap-1">
							<span class="shrink-0 text-xs font-light text-gray-600">
								{project.year}
							</span>
							<a href={`/projects/${project.id}`} class="min-w-0 hover:underline">
								<h2 class="text-lg font-medium leading-snug">{project.title}</h2>
							</a>
						</div>

						<p class="mt-3 text-sm font-light leading-relaxed text-gray-700">
							{project.description}
						</p>
					</div>
				</article>
			{/each}
		</div>

		{#if projects.length > 1}
			{#if canScrollPrevious}
				<div
					class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white via-white/90 to-transparent"
				></div>
				<button
					type="button"
					class="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-white text-xl shadow-sm hover:bg-black hover:text-white"
					aria-label="Previous projects"
					on:click={() => scrollCarousel(-1)}
				>
					&larr;
				</button>
			{/if}
			{#if canScrollNext}
				<div
					class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white via-white/90 to-transparent"
				></div>
				<button
					type="button"
					class="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-white text-xl shadow-sm hover:bg-black hover:text-white"
					aria-label="Next projects"
					on:click={() => scrollCarousel(1)}
				>
					&rarr;
				</button>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.carousel-track {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.carousel-track::-webkit-scrollbar {
		display: none;
	}
</style>
