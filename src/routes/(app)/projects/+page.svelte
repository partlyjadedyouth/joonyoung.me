<!--
	+page.svelte
	Renders the complete projects archive. It receives sorted project metadata from
	+page.ts and displays each project with the shared ProjectContainer card, in a
	zigzag two-column masonry layout on medium screens and above.
-->

<script lang="ts">
	import ProjectContainer from '$lib/components/ProjectContainer.svelte';

	// Route data supplies all projects gathered from markdown frontmatter.
	let { data } = $props();

	// Keep the archive reactive if the SvelteKit data layer refreshes this route.
	let projects = $derived(data.projects);

	// Deal projects into two columns left-to-right (0 → left, 1 → right, 2 → left, ...) so the
	// reading order stays zigzag while each column stacks cards at their natural heights.
	let columns = $derived(
		[0, 1].map((column) =>
			projects
				.map((project, index) => ({ project, index }))
				.filter(({ index }) => index % 2 === column)
		)
	);
</script>

<svelte:head>
	<title>projects | joonyoung park</title>
	<meta
		name="description"
		content="Projects by Joonyoung Park — HCI and human-AI interaction research, systems, and design work."
	/>
</svelte:head>

<!-- Main archive section mirrors the vertical spacing used by other route pages. -->
<section class="py-20">
	<h1 class="font-ibm font-medium text-2xl mb-5">PROJECTS</h1>

	<!--
		Masonry-style layout with zigzag order. On medium screens each column is a flex stack,
		so cards keep their own heights and the gap between them stays uniform. On small screens
		the column wrappers collapse via `contents` and the inline `order` restores the original
		sequence in a single column.
	-->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
		{#each columns as column}
			<div class="contents md:flex md:flex-col md:gap-4">
				{#each column as { project, index } (project.id)}
					<div style="order: {index}">
						<ProjectContainer
							{project}
							showLinks={false}
							showYear={true}
							widthClass="w-full"
							heightClass="h-auto"
							titleFontSizeClass="text-base"
							bodyFontSizeClass="text-xs"
							metaFontSizeClass="text-xs"
						/>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>
