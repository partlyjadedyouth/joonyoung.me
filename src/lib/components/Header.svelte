<!--
	Header.svelte
	Provides the global navigation bar for the main app routes. It reads the current
	SvelteKit page store so the active route can be underlined while preserving simple
	text links for home, about, and projects.
-->

<script>
	import { page } from '$app/stores';
</script>

<header>
	<!-- Navigation bar is right-aligned so it stays visually separate from page titles. -->
	<div class="flex justify-end px-5 py-4">
		<!-- Active-state classes are derived from the current path, including nested project pages. -->
		<div class="flex justify-center font-ibm font-light gap-5">
			<p class="hover:font-medium" class:underline={$page.url.pathname === '/'}>
				<a href="/">home</a>
			</p>
			<p class="hover:font-medium" class:underline={$page.url.pathname === '/about'}>
				<a href="/about">about</a>
			</p>
			<p class="hover:font-medium" class:underline={$page.url.pathname.includes('/projects')}>
				<a href="/projects">projects</a>
			</p>
			<!-- <p class="hover:font-medium" class:underline={$page.url.pathname.includes('/blog')}>
				<a href="/blog">blog</a>
			</p> -->
		</div>
	</div>
</header>
