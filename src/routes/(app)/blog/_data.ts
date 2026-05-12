/**
 * _data.ts
 * Centralizes blog post metadata discovery. It eagerly imports markdown index files,
 * filters to blog content entries, extracts frontmatter, sorts posts newest-first,
 * and exposes helpers for archive or limited-list consumers.
 */

import type { BlogPost } from '$lib/utils/definitions';

const blogModules = import.meta.glob('/src/routes/**/index.md', { eager: true });

// Invalid or missing dates sort to the bottom instead of throwing during route loading.
const getDateValue = (date: string) => {
	const parsed = Date.parse(date);
	return Number.isNaN(parsed) ? 0 : parsed;
};

// Build the sorted post list once so exported helpers can return non-mutating copies.
const posts = Object.entries(blogModules)
	.filter(([path]) => path.includes('/blog/(content)/'))
	.map(([, module]) => (module as { metadata?: BlogPost }).metadata)
	.filter((metadata): metadata is BlogPost => Boolean(metadata))
	.sort((a, b) => {
		const dateDiff = getDateValue(b.date) - getDateValue(a.date);
		if (dateDiff !== 0) {
			return dateDiff;
		}
		return a.title.localeCompare(b.title);
	});

export const getAllPosts = () => posts.slice();

export const getLatestPosts = (limit: number) => posts.slice(0, limit);
