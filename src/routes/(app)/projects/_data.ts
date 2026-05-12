import type { Project } from '$lib/utils/definitions';

const projectModules = import.meta.glob('/src/routes/**/index.md', { eager: true });

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
