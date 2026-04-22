import type { RequestHandler } from './$types';
import { getAllProjects } from '../(app)/projects/_data';
import { getAllPosts } from '../(app)/blog/_data';

export const prerender = true;

const SITE_URL = 'https://joonyoung.me';
const STATIC_PATHS = [
	'/',
	'/about',
	'/news',
	'/blog',
	'/projects',
	'/blackscreen',
	'/chi26-schedule'
] as const;

export const GET: RequestHandler = () => {
	const projectPaths = getAllProjects().map((project) => `/projects/${project.id}`);
	const blogPaths = getAllPosts().map((post) => `/blog/${post.id}`);
	const allPaths = [...STATIC_PATHS, ...projectPaths, ...blogPaths];
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
