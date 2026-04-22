import type { BlogPost } from '$lib/utils/definitions';

const blogModules = import.meta.glob('/src/routes/**/index.md', { eager: true });

const getDateValue = (date: string) => {
	const parsed = Date.parse(date);
	return Number.isNaN(parsed) ? 0 : parsed;
};

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
