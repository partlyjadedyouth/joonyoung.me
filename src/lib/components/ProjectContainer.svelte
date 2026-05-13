<!--
	ProjectContainer.svelte
	Renders a reusable project card with thumbnail, title, description, tags, optional
	resource links, and optional year metadata. Parent routes can choose whether the
	card links to a detail page and whether footer metadata should be displayed.
-->

<script lang="ts">
	import type { Project } from '$lib/utils/definitions';
	import documentIcon from '$lib/images/document.svg';
	import githubIcon from '$lib/images/github-mark.svg';
	import linkIcon from '$lib/images/link.svg';
	import videoIcon from '$lib/images/video.svg';

	export let project: Project;
	export let showLinks = true;
	export let showYear = false;
	export let linkToProject = true;
	export let widthClass = 'w-full';
	export let heightClass = 'h-full';
	export let titleFontSizeClass = 'text-base';
	export let bodyFontSizeClass = 'text-xs';
	export let metaFontSizeClass = 'text-xs';
	export let cardClass = '';

	$: bodyClass = 'flex flex-1 flex-col p-3';
	$: titleClass = `${titleFontSizeClass} font-medium leading-snug`;
	$: descriptionClass = `mt-2 ${bodyFontSizeClass} font-light leading-normal text-gray-700`;
	$: tagWrapperClass = 'mt-2 flex flex-wrap gap-1';
	$: tagClass = `rounded-md border border-black px-1.5 ${metaFontSizeClass} font-regular`;
	$: footerClass = 'mt-auto pt-3';
	$: linkWrapperClass = 'flex flex-wrap gap-x-3 gap-y-1.5';
	$: linkClass = `inline-flex items-center gap-1 ${metaFontSizeClass} font-light hover:underline`;
	$: linkIconClass = 'h-3 w-3';
	$: yearClass = `${metaFontSizeClass} font-light text-gray-600`;

	const linkLabels: Record<string, string> = {
		pdf: 'pdf',
		video: 'video',
		web: 'link',
		doi: 'doi',
		arxiv: 'arXiv',
		code: 'code',
		poster: 'poster'
	};

	const getLinkLabel = (type: string) => linkLabels[type] ?? type;

	const getLinkIcon = (type: string) => {
		if (type === 'video') return videoIcon;
		if (type === 'code') return githubIcon;
		if (type === 'pdf' || type === 'poster') return documentIcon;
		return linkIcon;
	};

	$: projectHref = `/projects/${project.id}`;
</script>

<!--
	The article wrapper owns the shared card styling. Hover treatment only applies
	when the card is configured to navigate to a project detail page.
-->
<article
	class={`flex ${widthClass} ${heightClass} flex-col overflow-hidden rounded-lg border border-gray-400 bg-white font-ibm transition-colors ${linkToProject ? 'hover:border-gray-800' : ''} ${cardClass}`}
>
	{#if linkToProject}
		<!-- Linked thumbnails make carousel and grid cards easy to open from the image. -->
		<a href={projectHref} class="block border-b border-gray-300">
			<img
				alt={project.title}
				src={project.thumbnail}
				class="aspect-[4/3] w-full rounded-t-lg object-cover"
			/>
		</a>
	{:else}
		<div class="border-b border-gray-300">
			<img
				alt={project.title}
				src={project.thumbnail}
				class="aspect-[4/3] w-full rounded-t-lg object-cover"
			/>
		</div>
	{/if}

	<!-- Card body keeps descriptive content above optional tags and footer metadata. -->
	<div class={bodyClass}>
		{#if linkToProject}
			<a href={projectHref} class="hover:underline">
				<h2 class={titleClass}>{project.title}</h2>
			</a>
		{:else}
			<h2 class={titleClass}>{project.title}</h2>
		{/if}

		<p class={descriptionClass}>
			{project.description}
		</p>

		{#if project.tags.length > 0}
			<!-- Tags summarize research areas and are omitted when the content data has none. -->
			<div class={tagWrapperClass}>
				{#each project.tags as tag}
					<span class={tagClass}>
						{tag}
					</span>
				{/each}
			</div>
		{/if}

		{#if showYear || (showLinks && project.links.length > 0)}
			<!-- Footer area is pushed to the bottom so cards in a grid keep aligned actions. -->
			<div class={footerClass}>
				{#if showLinks && project.links.length > 0}
					<div class={linkWrapperClass}>
						{#each project.links as link (`${project.id}-${link.type}-${link.url}`)}
							<a href={link.url} target="_blank" rel="noopener noreferrer" class={linkClass}>
								<img src={getLinkIcon(link.type)} alt="" class={linkIconClass} />
								{getLinkLabel(link.type)}
							</a>
						{/each}
					</div>
				{/if}

				{#if showYear}
					<p class={showLinks && project.links.length > 0 ? `mt-2 ${yearClass}` : yearClass}>
						{project.year}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</article>
