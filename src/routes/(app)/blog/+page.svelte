<script lang="ts">
	import BlogContainer from '$lib/components/BlogContainer.svelte';

	let { data } = $props();
	let posts = $derived(data.posts);
</script>

<svelte:head>
	<title>blog | joonyoung park</title>
	<meta name="description" content="Joonyoung's Blog" />
</svelte:head>

<section class="py-20">
	<h1 class="font-ibm font-medium text-2xl mb-5">BLOG</h1>

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
