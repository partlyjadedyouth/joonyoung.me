<script lang="ts">
	/**
	 * [/+page.svelte]
	 * This component renders the main page, displaying the profile, news highlights, and latest projects.
	 * It imports and uses ProfileContainer, NewsSection, and ProjectContainer components.
	 * The data for the projects is passed as a prop to this component.
	 */

	import HorizontalLine from '$lib/components/HorizontalLine.svelte';
	import ProfileContainer from '$lib/components/ProfileContainer.svelte';
	import NewsSection from '$lib/components/NewsSection.svelte';
	import ProjectContainer from '$lib/components/ProjectContainer.svelte';
	import newsData from '$lib/data/news.json';

	// Use $props() to receive data from the page load function
	let { data } = $props();

	// Derived values that update reactively when data changes
	let projects = $derived(data.projects);
	const recentNews = newsData.slice(0, 4);
</script>

<svelte:head>
	<title>joonyoung park</title>
	<meta name="description" content="Joonyoung's Blog" />
</svelte:head>

<!-- Profile section -->
<section class="pt-20 pb-10">
	<ProfileContainer />
</section>

<!-- CHI26 Scheduler announcement -->
<section class="pb-6">
	<a
		href="/chi26-schedule"
		class="relative block overflow-hidden rounded-xl border border-amber-300/80 px-4 py-4 shadow-[0_0_0_1px_rgba(250,204,21,0.45),0_0_30px_rgba(251,191,36,0.3)] transition hover:shadow-[0_0_0_1px_rgba(245,158,11,0.5),0_0_36px_rgba(251,191,36,0.38)] sm:px-5"
	>
		<div class="pointer-events-none absolute inset-0 rounded-xl"></div>
		<div class="relative z-10 space-y-1">
			<h2 class="font-ibm text-base font-medium">I developed a CHI26 scheduler!</h2>
			<p class="text-sm text-gray-700">
				Easily share and save your CHI26 schedule by URL, then export it to your calendar apps with
				an ICS file.
			</p>
		</div>
	</a>
</section>

<!-- Horizontal Line -->
<HorizontalLine my="10" />

<!-- News section -->
<section class="py-10">
	<div class="flex justify-between">
		<h1 class="font-ibm font-medium text-xl">News</h1>
		<a href="/news">
			<div
				class="text-xs font-medium border rounded px-3 py-1 border-gray-500 hover:bg-black hover:text-white"
			>
				View all
			</div>
		</a>
	</div>
	<NewsSection items={recentNews} />
</section>

<!-- Horizontal Line -->
<HorizontalLine my="10" />

<!-- Latest Projects section -->
<section class="py-10">
	<div class="flex justify-between">
		<!-- Title -->
		<h1 class="font-ibm font-medium text-xl">Latest Projects</h1>
		<!-- Link to /projects -->
		<a href="/projects">
			<div
				class="text-xs font-medium border rounded px-3 py-1 border-gray-500 hover:bg-black hover:text-white"
			>
				View all
			</div>
		</a>
	</div>

	<!-- Project container -->
	{#each projects.slice(0, 3) as project}
		<ProjectContainer
			id={project.id}
			year={project.year}
			title={project.title}
			description={project.description}
			thumbnail={project.thumbnail}
		/>
	{/each}
</section>
