<script lang="ts">
	import { onMount } from 'svelte';
	import type { Project } from '$lib/utils/definitions';
	import documentIcon from '$lib/images/document.svg';
	import githubIcon from '$lib/images/github-mark.svg';
	import linkIcon from '$lib/images/link.svg';
	import videoIcon from '$lib/images/video.svg';

	export let projects: Project[] = [];

	let carouselEl: HTMLDivElement | null = null;
	let canScrollPrevious = false;
	let canScrollNext = false;

	const linkLabels: Record<string, string> = {
		pdf: 'pdf',
		video: 'video',
		web: 'link',
		doi: 'doi',
		arxiv: 'arXiv',
		code: 'code',
		poster: 'poster'
	};

	const getLinkLabel = (type: string) => linkLabels[type] ?? type;

	const getLinkIcon = (type: string) => {
		if (type === 'video') return videoIcon;
		if (type === 'code') return githubIcon;
		if (type === 'pdf' || type === 'poster') return documentIcon;
		return linkIcon;
	};

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
					class="w-72 flex-none rounded-lg border border-gray-400 bg-white transition-colors hover:border-gray-800"
				>
					<a href={`/projects/${project.id}`} class="block border-b border-gray-300">
						<img
							alt={project.title}
							src={project.thumbnail}
							class="aspect-[4/3] w-full object-cover rounded-t-lg"
						/>
					</a>

					<div class="flex flex-1 flex-col p-4">
						<a href={`/projects/${project.id}`} class="hover:underline">
							<h2 class="text-lg font-medium leading-snug">{project.title}</h2>
						</a>

						<p class="mt-3 text-sm font-light leading-relaxed text-gray-700">
							{project.description}
						</p>

						{#if project.tags.length > 0}
							<div class="mt-2 flex flex-wrap gap-1.5">
								{#each project.tags as tag}
									<span class="rounded-lg border border-black px-2 text-sm font-regular">
										{tag}
									</span>
								{/each}
							</div>
						{/if}

						<div class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
							{#each project.links as link (`${project.id}-${link.type}-${link.url}`)}
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1 text-sm font-light hover:underline"
								>
									<img src={getLinkIcon(link.type)} alt="" class="h-3.5 w-3.5" />
									{getLinkLabel(link.type)}
								</a>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>

		{#if projects.length > 1}
			<div class="mt-4 flex items-center justify-between">
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
