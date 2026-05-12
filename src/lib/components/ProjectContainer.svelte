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
	export let cardClass = '';

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

<article
	class={`flex h-full flex-col overflow-hidden rounded-lg border border-gray-400 bg-white font-ibm transition-colors ${linkToProject ? 'hover:border-gray-800' : ''} ${cardClass}`}
>
	{#if linkToProject}
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

	<div class="flex flex-1 flex-col p-4">
		{#if linkToProject}
			<a href={projectHref} class="hover:underline">
				<h2 class="text-lg font-medium leading-snug">{project.title}</h2>
			</a>
		{:else}
			<h2 class="text-lg font-medium leading-snug">{project.title}</h2>
		{/if}

		<p class="mt-3 text-sm font-light leading-relaxed text-gray-700">
			{project.description}
		</p>

		{#if project.tags.length > 0}
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each project.tags as tag}
					<span class="rounded-lg border border-black px-2 text-sm font-regular">
						{tag}
					</span>
				{/each}
			</div>
		{/if}

		{#if showYear || (showLinks && project.links.length > 0)}
			<div class="mt-auto pt-4">
				{#if showLinks && project.links.length > 0}
					<div class="flex flex-wrap gap-x-4 gap-y-2">
						{#each project.links as link (`${project.id}-${link.type}-${link.url}`)}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 text-sm font-light hover:underline"
							>
								<img src={getLinkIcon(link.type)} alt="" class="h-3.5 w-3.5" />
								{getLinkLabel(link.type)}
							</a>
						{/each}
					</div>
				{/if}

				{#if showYear}
					<p
						class={showLinks && project.links.length > 0
							? 'mt-2 text-sm font-light text-gray-600'
							: 'text-sm font-light text-gray-600'}
					>
						{project.year}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</article>
