<!--
	+page.svelte
	Renders the homepage by combining the profile introduction, selected project
	carousel, and latest news highlights. Project data comes from the route load
	function, while news highlights are sliced locally from the shared news JSON.
-->

<script lang="ts">
	// import HorizontalLine from '$lib/components/HorizontalLine.svelte';
	import ProfileContainer from '$lib/components/ProfileContainer.svelte';
	import NewsSection from '$lib/components/NewsSection.svelte';
	import ProjectCarousel from '$lib/components/ProjectCarousel.svelte';
	import newsData from '$lib/data/news.json';

	// Route data supplies the selected projects gathered from markdown frontmatter.
	let { data } = $props();

	// Derived values keep the page reactive if SvelteKit refreshes the loaded data.
	let projects = $derived(data.projects);
	const recentNews = newsData.slice(0, 4);
</script>

<svelte:head>
	<title>joonyoung park</title>
	<meta name="description" content="Joonyoung's Blog" />
</svelte:head>

<!-- Opening profile section establishes identity and contact context before listing work. -->
<section class="pt-20 pb-10">
	<ProfileContainer />
</section>

<!-- Horizontal Line -->
<!-- <HorizontalLine my="10" /> -->

<!-- Selected projects are shown as a carousel on the homepage, with a path to the full archive. -->
<section class="py-10">
	<div class="flex justify-between">
		<h1 class="font-ibm font-medium text-xl">SELECTED PROJECTS</h1>
		<!-- The call-to-action keeps the homepage concise while exposing the complete project list. -->
		<a href="/projects">
			<div
				class="text-xs font-medium border rounded px-3 py-1 border-gray-500 hover:bg-black hover:text-white"
			>
				View all
			</div>
		</a>
	</div>

	<!-- ProjectCarousel owns horizontal scrolling, progress state, and responsive controls. -->
	<ProjectCarousel {projects} />
</section>

<!-- Horizontal Line -->
<!-- <HorizontalLine my="10" /> -->

<!-- Latest news reuses the archive component with a mobile limit for a shorter homepage preview. -->
<section class="py-10">
	<div class="flex justify-between">
		<h1 class="font-ibm font-medium text-xl">NEWS</h1>
		<a href="/news">
			<div
				class="text-xs font-medium border rounded px-3 py-1 border-gray-500 hover:bg-black hover:text-white"
			>
				View all
			</div>
		</a>
	</div>
	<NewsSection items={recentNews} mobileLimit={3} />
</section>
