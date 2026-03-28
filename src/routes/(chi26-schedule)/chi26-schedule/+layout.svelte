<script>
	/**
	 * [(chi26-schedule)/chi26-schedule/+layout.svelte]
	 * Custom layout for the CHI 2026 schedule page.
	 * Uses a wider container than the main site layout to accommodate
	 * the calendar-style grid. Includes the global CSS and a minimal
	 * header linking back to the main site.
	 */

	// Import global Tailwind styles
	import '../../../app.css';
</script>

<!-- Minimal top bar with back link to main site -->
<header>
	<div class="flex justify-between items-center px-5 py-4">
		<!-- Back link to the main portfolio site -->
		<a href="/" class="font-ibm text-sm font-light hover:underline text-gray-600">
			&larr; joonyoung.me
		</a>
	</div>
</header>

<!-- Main container — wider than the default site layout for schedule view -->
<div class="flex flex-col min-h-screen items-center">
	<main class="flex flex-col w-full flex-auto max-w-6xl px-4 sm:px-6">
		<!-- Slot renders the schedule page content -->
		<slot />
	</main>
</div>

<!-- Minimal footer -->
<footer>
	<div class="flex flex-col font-ibm text-xs font-light pt-2 pb-5 items-center text-gray-500">
		<p>
			Data sourced from
			<a
				class="hover:underline"
				href="https://programs.sigchi.org/chi/2026/program/all"
				target="_blank"
				rel="noopener noreferrer"
			>
				programs.sigchi.org
			</a>
		</p>
	</div>
</footer>
