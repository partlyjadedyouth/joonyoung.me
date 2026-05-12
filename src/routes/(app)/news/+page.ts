/**
 * +page.ts
 * Loads the complete news archive from the shared JSON data file. The data is typed
 * locally to keep the route contract explicit for +page.svelte.
 */

import type { PageLoad } from './$types';
import newsData from '$lib/data/news.json';

type NewsItem = {
	id: string;
	title: string;
	date: string;
	summary: string;
	link?: string;
};

export const load: PageLoad = async () => {
	// Casting keeps the imported JSON aligned with the route's public data shape.
	return { news: newsData as NewsItem[] };
};
