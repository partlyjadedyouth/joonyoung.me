<!--
	+layout.svelte
	Defines the shared application shell for every route inside src/routes/(app).
	It loads the global stylesheet, renders the persistent Header and Footer, and
	constrains each page's slot content to the same centered readable column.
-->

<script>
	import '../../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<!-- Header stays outside the centered page column so navigation can align with the viewport edge. -->
<Header />

<!-- Main wrapper fills the viewport height and centers route content horizontally. -->
<div class="flex flex-col min-h-screen items-center">
	<!-- Child pages render through the slot while inheriting one consistent max-width and padding system. -->
	<main class="flex flex-col w-full flex-auto max-w-xl px-6 sm:px-0">
		<slot />
	</main>
</div>

<!-- Footer is shared across all pages and sits below the flexible content area. -->
<Footer />
