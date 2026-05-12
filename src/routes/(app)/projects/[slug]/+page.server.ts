/**
 * +page.server.ts
 * Resolves a project detail route from its slug. The server load function looks up
 * the matching markdown index file, extracts frontmatter metadata, and returns a
 * 404 when the slug does not map to a known project.
 */

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Project } from '$lib/utils/definitions';

const projectModules = import.meta.glob('/src/routes/**/index.md', { eager: true });

export const load: PageServerLoad = ({ params }) => {
	const { slug } = params;
	const modulePath = `/src/routes/(app)/projects/(content)/${slug}/index.md`;

	// The metadata shape comes from markdown frontmatter and is validated by the presence check below.
	const module = projectModules[modulePath] as { metadata?: Project } | undefined;
	const projectData = module?.metadata;

	if (!projectData) {
		throw error(404, 'Project not found');
	}

	return {
		slug,
		project: projectData
	};
};
