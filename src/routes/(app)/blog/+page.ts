/**
 * +page.ts
 * Loads metadata for the blog archive. Blog discovery and sorting live in _data.ts,
 * keeping this route load function small and focused on the data contract for the
 * archive Svelte component.
 */

import { getAllPosts } from './_data';

export function load() {
	// Returned posts are already sorted newest-first by the shared data helper.
	return { posts: getAllPosts() };
}
