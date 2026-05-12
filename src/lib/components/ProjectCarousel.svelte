<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectContainer from '$lib/components/ProjectContainer.svelte';
	import type { Project } from '$lib/utils/definitions';

	export let projects: Project[] = [];

	let carouselEl: HTMLDivElement | null = null;
	let canScrollPrevious = false;
	let canScrollNext = false;
	let scrollProgress = 0;

	const updateScrollState = () => {
		if (!carouselEl) return;
		const maxScrollLeft = carouselEl.scrollWidth - carouselEl.clientWidth;
		canScrollPrevious = carouselEl.scrollLeft > 2;
		canScrollNext = carouselEl.scrollLeft < maxScrollLeft - 2;
		scrollProgress = maxScrollLeft > 0 ? carouselEl.scrollLeft / maxScrollLeft : 0;
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
		<div class="relative">
			<div
				class="carousel-track flex gap-4 overflow-x-auto pb-1"
				bind:this={carouselEl}
				on:scroll={updateScrollState}
			>
				{#each projects as project (project.id)}
					<ProjectContainer {project} cardClass="w-72 flex-none" />
				{/each}
			</div>

			{#if canScrollPrevious}
				<div
					class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent"
				></div>
			{/if}
			{#if canScrollNext}
				<div
					class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"
				></div>
			{/if}
		</div>

		{#if projects.length > 1}
			<div
				class="mt-4 h-px w-full bg-gray-300 sm:hidden"
				role="progressbar"
				aria-label="Project carousel position"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={Math.round(scrollProgress * 100)}
			>
				<div
					class="h-px bg-black"
					style:width={`${Math.max(100 / projects.length, 12)}%`}
					style:margin-left={`calc((100% - ${Math.max(100 / projects.length, 12)}%) * ${scrollProgress})`}
				></div>
			</div>

			<div class="mt-4 hidden items-center gap-4 sm:flex">
				{#if canScrollPrevious}
					<button
						type="button"
						class="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white text-xl shadow-sm hover:bg-black hover:text-white"
						aria-label="Previous projects"
						on:click={() => scrollCarousel(-1)}
					>
						&larr;
					</button>
				{:else}
					<div class="h-10 w-10" aria-hidden="true"></div>
				{/if}
				<div
					class="h-px flex-1 bg-gray-300"
					role="progressbar"
					aria-label="Project carousel position"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={Math.round(scrollProgress * 100)}
				>
					<div
						class="h-px bg-black"
						style:width={`${Math.max(100 / projects.length, 12)}%`}
						style:margin-left={`calc((100% - ${Math.max(100 / projects.length, 12)}%) * ${scrollProgress})`}
					></div>
				</div>
				{#if canScrollNext}
					<button
						type="button"
						class="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white text-xl shadow-sm hover:bg-black hover:text-white"
						aria-label="Next projects"
						on:click={() => scrollCarousel(1)}
					>
						&rarr;
					</button>
				{:else}
					<div class="h-10 w-10" aria-hidden="true"></div>
				{/if}
			</div>
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
