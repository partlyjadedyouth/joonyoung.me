/**
 * +page.server.ts
 * Resolves a blog detail route from its slug. The server load function reads the
 * matching markdown frontmatter and returns a 404 for unknown post slugs before the
 * client attempts to import the markdown body.
 */

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { BlogPost } from '$lib/utils/definitions';

const blogModules = import.meta.glob('/src/routes/**/index.md', { eager: true });

export const load: PageServerLoad = ({ params }) => {
	const { slug } = params;
	const modulePath = `/src/routes/(app)/blog/(content)/${slug}/index.md`;

	// The markdown plugin exposes post metadata through the module's frontmatter export.
	const module = blogModules[modulePath] as { metadata?: BlogPost } | undefined;
	const postData = module?.metadata;

	if (!postData) {
		throw error(404, 'Post not found');
	}

	return {
		slug,
		post: postData
	};
};
