/**
 * +page.ts
 * Loads homepage data for the app root route. The homepage only needs selected
 * project metadata, so this load function delegates to the project data helper
 * that has already gathered and sorted markdown frontmatter.
 */

import { getSelectedProjects } from './projects/_data';

export function load() {
	// Returned data is consumed by +page.svelte to render the selected-project carousel.
	return { projects: getSelectedProjects() };
}
