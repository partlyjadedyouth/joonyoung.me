<!--
	+page.svelte
	Renders the news archive route. It receives all news records from +page.ts and
	passes them to NewsSection without a mobile limit so every update remains visible.
-->

<script lang="ts">
	import NewsSection from '$lib/components/NewsSection.svelte';

	// Route data supplies the full news array from the shared JSON file.
	let { data } = $props();

	// The empty fallback lets NewsSection render its empty state if data is unavailable.
	let news = $derived(data.news ?? []);
</script>

<svelte:head>
	<title>news | joonyoung park</title>
	<meta name="description" content="Latest news and updates from Joonyoung Park." />
</svelte:head>

<!-- Archive heading and list share the same spacing rhythm as other top-level pages. -->
<div class="py-20">
	<h1 class="font-ibm font-medium text-2xl mb-5">NEWS</h1>
	<NewsSection items={news} />
</div>
