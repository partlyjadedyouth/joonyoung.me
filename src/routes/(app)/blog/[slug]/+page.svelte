<script lang="ts">
	import type { PageData } from './$types';
	import type { Component } from 'svelte';

	let { data }: { data: PageData } = $props();
	let post = $derived(data.post);
	let slug = $derived(data.slug);

	const blogModules = import.meta.glob('/src/routes/**/index.md');
	let Content = $state<Component | null>(null);
	let contentError = $state<Error | null>(null);
	let isLoading = $state(false);
	let postContainerEl = $state<HTMLDivElement | null>(null);

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

	function addHoverEffectToLinks() {
		const postContainer = postContainerEl;
		if (postContainer) {
			const links = postContainer.getElementsByTagName('a');
			for (let link of links) {
				link.classList.add('hover:underline');
			}
		}
	}

	function alignImageCaptionsCenter() {
		const postContainer = postContainerEl;
		if (postContainer) {
			const captions = postContainer.getElementsByTagName('em');
			for (let caption of captions) {
				caption.classList.add('align-center');
			}
		}
	}

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
			'z-50',
			'p-10'
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

	function cleanup() {
		const postContainer = postContainerEl;
		if (postContainer) {
			const images = postContainer.getElementsByTagName('img');
			for (let img of images) {
				img.removeEventListener('click', handleImageClick);
			}
		}
	}

	function setupPage() {
		cleanup();
		addPaddingToElements();
		formatImages();
		addHoverEffectToLinks();
		alignImageCaptionsCenter();
	}

	$effect(() => {
		const modulePath = `/src/routes/(app)/blog/(content)/${slug}/index.md`;
		const loader = blogModules[modulePath];
		Content = null;
		contentError = null;
		isLoading = true;

		if (!loader) {
			contentError = new Error('Post content not found');
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
	<title>{post.title}</title>
	<meta name="description" content="Joonyoung's Blog" />
</svelte:head>

<section class="flex flex-col items-center py-20">
	<p class="font-biryani font-semibold text-3xl text-center">{post.title}</p>
	<p class="font-ibm mt-1 text-lg">{post.date}</p>

	<div class="mt-5 font-ibm">
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
	</div>
</section>
