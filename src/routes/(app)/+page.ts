/**
 * [/+page.ts]
 * This module defines the load function to fetch and parse markdown files
 * for selected projects. It retrieves the frontmatter metadata for
 * each project and returns an array of project data.
 */

import { getSelectedProjects } from './projects/_data';

export function load() {
	// Returning the projects array as a response
	return { projects: getSelectedProjects() };
}
