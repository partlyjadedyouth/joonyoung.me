<!--
	+layout.svelte
	Root layout wrapping every route group. Emits a self-referencing canonical link
	for the current path so search engines consolidate ranking signals onto one URL
	and are not left guessing which variant (trailing slash, query params) is primary.
-->
<script>
	import { page } from '$app/state';

	// Canonical URLs use the fixed production origin so preview/staging deploys never
	// leak their own hostnames into indexing signals; only the path varies per route.
	const SITE_URL = 'https://joonyoung.me';
</script>

<svelte:head>
	<link rel="canonical" href={`${SITE_URL}${page.url.pathname}`} />
</svelte:head>

<slot />
