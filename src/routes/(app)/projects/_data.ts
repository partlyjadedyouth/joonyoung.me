/**
 * _data.ts
 * Centralizes project metadata discovery for homepage and archive routes. Vite's
 * import.meta.glob eagerly imports every markdown index file, then this module keeps
 * only project content entries, extracts their frontmatter, and exposes sorted helpers.
 */

import type { Project } from '$lib/utils/definitions';

const projectModules = import.meta.glob('/src/routes/**/index.md', { eager: true });

// Convert year strings like "2024", "2023-2024", or malformed values into sortable numbers.
const getYearValue = (year: string) => {
	const matches = year.match(/\d{4}/g);
	if (!matches || matches.length === 0) {
		return 0;
	}
	if (matches.length >= 2) {
		const start = Number(matches[0]);
		const end = Number(matches[1]);
		return (start + end) / 2;
	}
	return Number(matches[0]);
};

// Eagerly build one sorted project list so each exported helper can return cheap copies.
const projects = Object.entries(projectModules)
	.filter(([path]) => path.includes('/projects/(content)/'))
	.map(([, module]) => (module as { metadata?: Project }).metadata)
	.filter((metadata): metadata is Project => Boolean(metadata))
	.sort((a, b) => {
		const yearDiff = getYearValue(b.year) - getYearValue(a.year);
		if (yearDiff !== 0) {
			return yearDiff;
		}
		return a.title.localeCompare(b.title);
	});

export const getAllProjects = () => projects.slice();

export const getLatestProjects = (limit: number) => projects.slice(0, limit);

export const getSelectedProjects = () => projects.filter((project) => project.selected);
