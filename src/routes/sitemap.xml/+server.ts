import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { RequestHandler } from './$types';
import { getAllProjects } from '../(app)/projects/_data';
import { getAllPosts } from '../(app)/blog/_data';

// Prerendered at build time, so Node's fs is available to enumerate static assets below.
export const prerender = true;

const SITE_URL = 'https://joonyoung.me';

const PROJECT_CONTENT_DIR = 'src/routes/(app)/projects/(content)';
const BLOG_CONTENT_DIR = 'src/routes/(app)/blog/(content)';
const NEWS_DATA = 'src/lib/data/news.json';

// Top-level routes that are not generated from a content collection must be listed by hand,
// together with the source paths whose last commit date becomes the page's <lastmod>.
// (Add new standalone pages here; project/blog/PDF entries are discovered automatically.)
const STATIC_PAGES: Record<string, string[]> = {
	'/': [
		'src/routes/(app)/+page.svelte',
		'src/routes/(app)/+page.ts',
		NEWS_DATA,
		PROJECT_CONTENT_DIR
	],
	'/about': ['src/routes/(app)/about'],
	'/news': ['src/routes/(app)/news', NEWS_DATA],
	'/blog': [
		'src/routes/(app)/blog/+page.svelte',
		'src/routes/(app)/blog/+page.ts',
		BLOG_CONTENT_DIR
	],
	'/projects': [
		'src/routes/(app)/projects/+page.svelte',
		'src/routes/(app)/projects/+page.ts',
		PROJECT_CONTENT_DIR
	],
	'/blackscreen': ['src/routes/(blackscreen)/blackscreen'],
	'/chi26-schedule': ['src/routes/(chi26-schedule)/chi26-schedule']
};

const git = (args: string[]) =>
	execFileSync('git', args, {
		cwd: process.cwd(),
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'ignore']
	}).trim();

// In a shallow clone, files untouched within the fetched depth appear to be added by the oldest
// fetched commit, so dates from those boundary commits are wrong and must be discarded.
const getShallowBoundaries = () => {
	try {
		const shallowFile = git(['rev-parse', '--git-path', 'shallow']);
		return existsSync(shallowFile)
			? new Set(readFileSync(shallowFile, 'utf8').split('\n').filter(Boolean))
			: new Set<string>();
	} catch {
		return new Set<string>();
	}
};
const shallowBoundaries = getShallowBoundaries();

// Returns the last commit date touching any of the given paths, or undefined when git history is
// unavailable. Omitting <lastmod> is better than reporting the build time, which Google learns to ignore.
const getLastModified = (paths: string[]) => {
	try {
		const [hash, date] = git(['log', '-1', '--format=%H %cI', '--', ...paths]).split(' ');
		return hash && date && !shallowBoundaries.has(hash) ? date : undefined;
	} catch {
		return undefined;
	}
};

// Enumerate hosted PDFs from static/pdfs so every file is listed and new ones appear without
// touching this file. process.cwd() is the project root during the prerender build step.
const getPdfPaths = () => {
	try {
		return readdirSync(join(process.cwd(), 'static', 'pdfs'))
			.filter((name) => name.toLowerCase().endsWith('.pdf'))
			.sort()
			.map((name) => `/pdfs/${name}`);
	} catch {
		// A missing or unreadable directory must not break the build; emit no PDF entries.
		return [];
	}
};

export const GET: RequestHandler = () => {
	const entries: [string, string[]][] = [
		...Object.entries(STATIC_PAGES),
		...getAllProjects().map((project): [string, string[]] => [
			`/projects/${project.id}`,
			[`${PROJECT_CONTENT_DIR}/${project.id}`]
		]),
		...getAllPosts().map((post): [string, string[]] => [
			`/blog/${post.id}`,
			[`${BLOG_CONTENT_DIR}/${post.id}`]
		]),
		...getPdfPaths().map((path): [string, string[]] => [path, [`static${path}`]])
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(([path, sources]) => {
		const lastmod = getLastModified(sources);
		return `  <url>
    <loc>${SITE_URL}${path}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`;
	})
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
