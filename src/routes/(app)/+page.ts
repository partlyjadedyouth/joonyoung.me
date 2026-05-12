/**
 * [/+page.ts]
 * This module defines the load function to fetch and parse markdown files
 * for the latest projects. It retrieves the frontmatter metadata for
 * each project and returns an array of project data.
 */

import { getLatestProjects } from './projects/_data';

export function load() {
	// Returning the projects array as a response
	return { projects: getLatestProjects(8) };
}
