<script lang="ts">
	/**
	 * [/projects/+page.svelte]
	 * This component renders a list of projects. It sets the page title and description,
	 * and displays each project with the shared project card UI.
	 */

	import ProjectContainer from '$lib/components/ProjectContainer.svelte';

	// Use $props() to receive data from the page load function
	let { data } = $props();

	// Create a derived value for projects that updates when data changes
	let projects = $derived(data.projects);
</script>

<svelte:head>
	<!-- Setting the page title to 'projects' -->
	<title>projects | joonyoung park</title>
	<!-- Adding meta description for SEO purposes -->
	<meta name="description" content="Joonyoung's Blog" />
</svelte:head>

<!-- Main section with padding on the y-axis -->
<section class="py-20">
	<!-- Heading for the projects section with specific font classes and margin -->
	<h1 class="font-ibm font-medium text-2xl mb-5">PROJECTS</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each projects as project (project.id)}
			<ProjectContainer {project} showLinks={false} showYear={true} />
		{/each}
	</div>
</section>
