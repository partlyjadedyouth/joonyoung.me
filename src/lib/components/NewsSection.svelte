<script lang="ts">
	import HorizontalLine from '$lib/components/HorizontalLine.svelte';
	import newsData from '$lib/data/news.json';

	type NewsItem = {
		id: string;
		title: string;
		date: string;
		summary: string;
		link?: string;
	};

	export let items: NewsItem[] | null = null;
	export let mobileLimit: number | null = null;

	let news: NewsItem[] = items ?? newsData;

	const formatDate = (isoDate: string) => {
		try {
			return new Intl.DateTimeFormat('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			}).format(new Date(isoDate));
		} catch {
			return isoDate;
		}
	};
</script>

<section>
	{#if news.length === 0}
		<p class="mt-6 font-ibm text-sm text-gray-500">
			No news to share just yet. Please check back soon.
		</p>
	{:else}
		<div class="mt-6 border border-gray-400 rounded-lg">
			{#each news as item, index (item.id)}
				<div class={mobileLimit !== null && index >= mobileLimit ? 'hidden sm:block' : ''}>
					<article class="font-ibm p-5">
						<p class="mt-3 text-xs font-light tracking-wide text-gray-500">
							{formatDate(item.date)}
						</p>
						<h2 class="text-lg font-medium">{item.title}</h2>
						<p class="mt-2 mb-3 text-sm font-light leading-relaxed text-gray-700">
							{@html item.summary}
						</p>
					</article>
					{#if index < news.length - 1}
						<div class={mobileLimit !== null && index === mobileLimit - 1 ? 'hidden sm:block' : ''}>
							<HorizontalLine w="full" color="gray" />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
