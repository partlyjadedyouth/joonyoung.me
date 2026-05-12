<!--
	+page.svelte
	Renders the complete projects archive. It receives sorted project metadata from
	+page.ts and displays each project with the shared ProjectContainer card, using a
	two-column grid on medium screens and above.
-->

<script lang="ts">
	import ProjectContainer from '$lib/components/ProjectContainer.svelte';

	// Route data supplies all projects gathered from markdown frontmatter.
	let { data } = $props();

	// Keep the archive reactive if the SvelteKit data layer refreshes this route.
	let projects = $derived(data.projects);
</script>

<svelte:head>
	<title>projects | joonyoung park</title>
	<meta name="description" content="Joonyoung's Blog" />
</svelte:head>

<!-- Main archive section mirrors the vertical spacing used by other route pages. -->
<section class="py-20">
	<h1 class="font-ibm font-medium text-2xl mb-5">PROJECTS</h1>

	<!-- Cards do not link through their footer resources here; the year acts as compact metadata. -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each projects as project (project.id)}
			<ProjectContainer {project} showLinks={false} showYear={true} />
		{/each}
	</div>
</section>
