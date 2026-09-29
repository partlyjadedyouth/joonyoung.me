/**
 * +page.ts
 * Loads the markdown body component for a project detail route. Running this in a
 * universal load function makes the body part of the server-rendered HTML, so
 * crawlers receive the full project text instead of an empty content container.
 */

import type { Component } from 'svelte';
import type { PageLoad } from './$types';

const projectModules = import.meta.glob('/src/routes/**/index.md');

export const load: PageLoad = async ({ data }) => {
	const modulePath = `/src/routes/(app)/projects/(content)/${data.slug}/index.md`;
	const module = (await projectModules[modulePath]()) as { default: Component };

	return {
		...data,
		Content: module.default
	};
};
