<script lang="ts">
	/**
	 * [/projects/+page.svelte]
	 * This component renders a list of projects. It sets the page title and description,
	 * and iterates over the projects data to display each project using the ProjectContainer component.
	 */

	// Importing the ProjectContainer component from the specified path
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

	<!-- Looping through the 'projects' array and rendering ProjectContainer for each project -->
	{#each projects as project}
		<!-- ProjectContainer component with project details passed as props -->
		<ProjectContainer
			id={project.id}
			year={project.year}
			title={project.title}
			description={project.description}
			thumbnail={project.thumbnail}
			tags={project.tags}
		/>
	{/each}
</section>
