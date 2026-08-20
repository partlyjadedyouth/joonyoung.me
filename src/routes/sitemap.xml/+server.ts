import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { RequestHandler } from './$types';
import { getAllProjects } from '../(app)/projects/_data';
import { getAllPosts } from '../(app)/blog/_data';

// Prerendered at build time, so Node's fs is available to enumerate static assets below.
export const prerender = true;

const SITE_URL = 'https://joonyoung.me';

// Top-level routes that are not generated from a content collection must be listed by hand.
// (Add new standalone pages here; project/blog/PDF entries are discovered automatically.)
const STATIC_PATHS = [
	'/',
	'/about',
	'/news',
	'/blog',
	'/projects',
	'/blackscreen',
	'/chi26-schedule'
] as const;

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
	const projectPaths = getAllProjects().map((project) => `/projects/${project.id}`);
	const blogPaths = getAllPosts().map((post) => `/blog/${post.id}`);
	const pdfPaths = getPdfPaths();
	const allPaths = [...STATIC_PATHS, ...projectPaths, ...blogPaths, ...pdfPaths];
	const lastmod = new Date().toISOString();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
	.map(
		(path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
