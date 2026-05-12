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
		pdf: 'PDF',
		video: 'Video',
		web: 'Demo',
		doi: 'DOI',
		arxiv: 'arXiv',
		code: 'Code',
		poster: 'Poster'
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
					class="flex h-[27rem] w-[15.5rem] flex-none flex-col border border-gray-400 bg-white transition-colors hover:border-gray-800"
				>
					<a href={`/projects/${project.id}`} class="block border-b border-gray-300">
						<img
							alt={project.title}
							src={project.thumbnail}
							class="aspect-[4/3] w-full object-cover"
						/>
					</a>

					<div class="flex flex-1 flex-col p-4">
						<div class="flex items-start justify-between gap-3">
							<a href={`/projects/${project.id}`} class="min-w-0 hover:underline">
								<h2 class="project-card-title text-lg font-medium leading-snug">
									{project.title}
								</h2>
							</a>
							<span
								class="shrink-0 rounded border border-gray-300 px-2 py-1 text-xs font-light text-gray-600"
							>
								{project.year}
							</span>
						</div>

						<p
							class="project-card-description mt-3 text-sm font-light leading-relaxed text-gray-700"
						>
							{project.description}
						</p>

						<div class="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-4">
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

	.project-card-title,
	.project-card-description {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.project-card-title {
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.project-card-description {
		-webkit-line-clamp: 4;
		line-clamp: 4;
	}
</style>
