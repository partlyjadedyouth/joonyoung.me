/**
 * +page.ts
 * Loads metadata for the full projects archive. The heavy lifting lives in _data.ts,
 * which imports markdown frontmatter, filters project content, and returns the sorted
 * project list used by the archive page.
 */

import { getAllProjects } from './_data';

export function load() {
	// Returned data is consumed by +page.svelte to render the project card grid.
	return { projects: getAllProjects() };
}
