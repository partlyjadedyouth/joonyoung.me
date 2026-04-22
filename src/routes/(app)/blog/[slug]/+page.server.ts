import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { BlogPost } from '$lib/utils/definitions';

const blogModules = import.meta.glob('/src/routes/**/index.md', { eager: true });

export const load: PageServerLoad = ({ params }) => {
	const { slug } = params;
	const modulePath = `/src/routes/(app)/blog/(content)/${slug}/index.md`;
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
