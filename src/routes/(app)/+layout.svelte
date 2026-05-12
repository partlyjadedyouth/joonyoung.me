<script>
	/**
	 * [/+layout.svelte]
	 * This component serves as the main layout for the application. It imports global CSS styles,
	 * and includes the Header and Footer components. The layout ensures that the content
	 * between the Header and Footer is centered and takes up the minimum height of the screen.
	 */

	// Importing global CSS styles
	import '../../app.css';
	// Importing the Header component
	import Header from '$lib/components/Header.svelte';
	// Importing the Footer component
	import Footer from '$lib/components/Footer.svelte';
</script>

<!-- Rendering the Header component -->
<Header />
<!-- Main container for the layout with flexbox properties -->
<div class="flex flex-col min-h-screen items-center">
	<!-- Main content area with responsive width settings -->
	<main class="flex flex-col w-full flex-auto max-w-xl px-6 sm:px-0">
		<!-- Slot to render the child content passed to this layout -->
		<slot />
	</main>
</div>
<!-- Rendering the Footer component -->
<Footer />
