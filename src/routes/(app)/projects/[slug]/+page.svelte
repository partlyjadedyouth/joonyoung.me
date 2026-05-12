<!--
	+page.svelte
	Renders an individual project detail page. It receives frontmatter metadata from
	the server load function, dynamically imports the matching markdown body, and then
	applies consistent spacing, link styling, and fullscreen image behavior to the
	rendered markdown content.
-->

<script lang="ts">
	import LinkContainer from '$lib/components/LinkContainer.svelte';
	import awardIcon from '$lib/images/award.png';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';

	// Route data includes the URL slug and project frontmatter found on the server.
	let { data }: { data: PageData } = $props();
	let project = $derived(data.project);
	let slug = $derived(data.slug);

	// Split colon-delimited titles into primary title and subtitle for clearer typography.
	const splitProjectTitle = (title: string) => {
		const separatorIndex = title.indexOf(':');
		if (separatorIndex === -1) {
			return { title, subtitle: '' };
		}

		return {
			title: title.slice(0, separatorIndex).trim(),
			subtitle: title.slice(separatorIndex + 1).trim()
		};
	};
	let titleParts = $derived(splitProjectTitle(project.title));

	const projectModules = import.meta.glob('/src/routes/**/index.md');
	let Content = $state<Component | null>(null);
	let contentError = $state<Error | null>(null);
	let isLoading = $state(false);
	let postContainerEl = $state<HTMLDivElement | null>(null);

	// Markdown output does not know about the page layout, so direct children receive spacing classes here.
	function addPaddingToElements() {
		const container = postContainerEl;
		if (container) {
			const children = container.children;
			for (const child of children) {
				if (!child.children[0] || child.children[0].tagName !== 'IMG') {
					child.classList.add('sm:px-10');
				} else if (child.children[0] && child.children[0].tagName === 'IMG') {
					child.classList.add('py-5', 'flex', 'flex-col', 'items-center');
				}
			}
		}
	}

	// Project images become bordered, rounded, full-width, and clickable after markdown renders.
	function formatImages() {
		const postContainer = postContainerEl;
		if (postContainer) {
			const images = postContainer.getElementsByTagName('img');
			for (let img of images) {
				img.classList.add('rounded', 'border', 'border-gray-400', 'w-full', 'cursor-pointer');
				img.addEventListener('click', handleImageClick);
			}
		}
	}

	// Markdown links get the same hover treatment as hand-authored links elsewhere on the site.
	function addHoverEffectToLinks() {
		const postContainer = postContainerEl;
		if (postContainer) {
			const links = postContainer.getElementsByTagName('a');
			for (let link of links) {
				link.classList.add('hover:underline');
			}
		}
	}

	// Image captions generated as emphasized text are centered to match the image presentation.
	function alignImageCaptionsCenter() {
		const postContainer = postContainerEl;
		if (postContainer) {
			const captions = postContainer.getElementsByTagName('em');
			for (let caption of captions) {
				caption.classList.add('align-center');
			}
		}
	}

	// Clicking a markdown image opens a lightweight fullscreen overlay that closes on click.
	function handleImageClick(event: MouseEvent) {
		const img = event.target as HTMLImageElement;

		const fullscreenContainer = document.createElement('div');
		fullscreenContainer.id = 'fullscreen-container';
		fullscreenContainer.classList.add(
			'fixed',
			'inset-0',
			'bg-black',
			'bg-opacity-75',
			'flex',
			'items-center',
			'justify-center',
			'z-50'
			// 'p-10'
		);

		const fullscreenImage = document.createElement('img');
		fullscreenImage.src = img.src;
		fullscreenImage.classList.add('max-w-full', 'max-h-full');

		fullscreenContainer.appendChild(fullscreenImage);
		document.body.appendChild(fullscreenContainer);

		fullscreenContainer.addEventListener('click', () => {
			document.body.removeChild(fullscreenContainer);
		});
	}

	// Remove image listeners before reformatting or unmounting to avoid duplicate click handlers.
	function cleanup() {
		const postContainer = postContainerEl;
		if (postContainer) {
			const images = postContainer.getElementsByTagName('img');
			for (let img of images) {
				img.removeEventListener('click', handleImageClick);
			}
		}
	}

	// Apply all markdown presentation enhancements in one pass.
	function setupPage() {
		cleanup(); // Clean up old event listeners
		addPaddingToElements();
		formatImages();
		addHoverEffectToLinks();
		alignImageCaptionsCenter();
	}

	// Load the route-specific markdown component whenever the slug changes.
	$effect(() => {
		const modulePath = `/src/routes/(app)/projects/(content)/${slug}/index.md`;
		const loader = projectModules[modulePath];
		Content = null;
		contentError = null;
		isLoading = true;

		if (!loader) {
			contentError = new Error('Project content not found');
			isLoading = false;
			return;
		}

		loader()
			.then((module) => {
				Content = (module as { default: Component }).default;
			})
			.catch((error) => {
				contentError = error as Error;
			})
			.finally(() => {
				isLoading = false;
			});

		return () => {
			cleanup();
		};
	});

	// Observe the markdown container because dynamically imported content arrives after initial render.
	$effect(() => {
		if (!postContainerEl) {
			return;
		}

		const observer = new MutationObserver(() => {
			setupPage();
		});

		observer.observe(postContainerEl, { childList: true, subtree: true });
		setupPage();

		return () => {
			observer.disconnect();
			cleanup();
		};
	});
</script>

<svelte:head>
	<title>{project.title}</title>
	<meta name="description" content="Joonyoung's Blog" />
</svelte:head>

<!-- Project header presents date, award, title, subtitle, and resource links above the markdown body. -->
<section class="flex flex-col items-start py-20">
	<div class="flex flex-col">
		{#if project.award}
			<!-- Optional award callout is omitted entirely for projects without recognition metadata. -->
			<div class="font-barlow font-medium text-lg italic flex items-center gap-2">
				<img src={awardIcon} alt="Award" class="h-6" />
				<span>{project.award}</span>
			</div>
		{/if}
	</div>

	<div>
		<!-- Colon-delimited project titles are rendered as a title/subtitle pair when possible. -->
		{#if titleParts.subtitle}
			<p class="mt-3 font-biryani text-xl font-semibold leading-snug text-left sm:text-3xl">
				{titleParts.title}
			</p>
			<div class="font-biryani font-regular text-lg leading-snug text-left sm:text-2xl">
				{titleParts.subtitle}
				<!-- Project year is shown before the title to match academic portfolio conventions. -->
				<p class="inline-block text-lg font-light leading-snug sm:text-2xl">
					({project.year})
				</p>
			</div>
		{:else}
			<div class="mt-3 font-biryani text-xl font-semibold leading-snug text-left sm:text-3xl">
				{titleParts.title}
				<!-- Project year is shown before the title to match academic portfolio conventions. -->
				<p class="inline-block text-lg font-light leading-snug sm:text-2xl">
					({project.year})
				</p>
			</div>
		{/if}
	</div>

	<!-- Resource links use LinkContainer so icon and label behavior stays consistent across project pages. -->
	<div class="mt-3 flex items-center justify-start gap-x-2">
		{#each project.links as link}
			<LinkContainer type={link.type} url={link.url} />
		{/each}
	</div>

	<div class="mt-5 font-ibm">
		<!-- Markdown body renders through a dynamic Svelte component with loading and error states. -->
		<div
			class="font-light hyphenate flex flex-col space-y-5"
			id="post-container"
			bind:this={postContainerEl}
		>
			{#if isLoading}
				<p class="text-sm text-gray-500">Loading content...</p>
			{:else if contentError}
				<p class="text-sm text-gray-500">Failed to load content.</p>
			{:else if Content}
				<Content />
			{/if}
		</div>
		<!-- Role summary explains the author's contribution after the project narrative. -->
		<div class="sm:mx-10">
			<hr class="border-[0.5px] border-gray-500 w-full mt-12" />
			<p class="mt-2 font-medium">What I've done...</p>
			<p class="mt-1 text-sm font-light">{project.role}</p>
		</div>
	</div>
</section>
