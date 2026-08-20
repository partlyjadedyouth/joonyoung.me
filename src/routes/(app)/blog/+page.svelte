<!--
	+page.svelte
	Renders the blog archive route. It receives sorted post metadata from +page.ts
	and passes each record into BlogContainer so every archive entry uses the same
	clickable preview-card structure.
-->

<script lang="ts">
	import BlogContainer from '$lib/components/BlogContainer.svelte';

	// Route data supplies blog post metadata collected from markdown frontmatter.
	let { data } = $props();
	let posts = $derived(data.posts);
</script>

<svelte:head>
	<title>blog | joonyoung park</title>
	<meta
		name="description"
		content="Blog by Joonyoung Park — notes and writing on HCI, human-AI interaction, and research."
	/>
</svelte:head>

<!-- Blog archive section mirrors the spacing and heading scale of other index routes. -->
<section class="py-20">
	<h1 class="font-ibm font-medium text-2xl mb-5">BLOG</h1>

	<!-- Each BlogContainer owns its own link target and optional thumbnail display. -->
	{#each posts as post}
		<BlogContainer
			id={post.id}
			date={post.date}
			title={post.title}
			description={post.description}
			thumbnail={post.thumbnail}
		/>
	{/each}
</section>
