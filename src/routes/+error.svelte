<script lang="ts">
	/**
	 * [/+error.svelte]
	 * Global error page aligned with the site's minimal layout and typography.
	 * Features a cute, geeky, nerdy design with ASCII art and terminal aesthetics.
	 */

	import '../app.css';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';

	// Access status and error from the page state (SvelteKit 2 approach)
	const status = $derived(page.status);
	const error = $derived(page.error);

	// ASCII art for 404 error
	const ascii404 = `    __ __   ___  __ __
   / // /  / _ \\/ // /
  / // /_ / // / // /_
 /__  __// // /__  __/
   /_/   \\___/  /_/   `;

	// ASCII art for 500 error
	const ascii500 = `    ______   ___   ___
   / ____/  / _ \\ / _ \\
  /___ \\   / // // // /
 ____/ /  / // // // /
/_____/   \\___/ \\___/ `;

	// ASCII art for other errors
	const asciiGeneric = `    ______ ___   ___
   / ____// _ \\ / _ \\
  / __/  / , _// , _/
 / /___ / /| |/ /| |
/_____//_/ |_/_/ |_| `;

	// Select ASCII art based on status code
	const asciiArt = $derived(status === 404 ? ascii404 : status >= 500 ? ascii500 : asciiGeneric);

	// Geeky error messages based on status code
	const errorTitle = $derived(
		status === 404
			? 'Oops! This page ran away...'
			: status === 500
				? 'Internal Server Meltdown'
				: status === 403
					? 'Access Denied'
					: 'Something broke in production'
	);
</script>

<svelte:head>
	<title>{status} | joonyoung park</title>
	<meta name="description" content="Error page" />
</svelte:head>

<!-- <Header /> -->
<div class="flex flex-col min-h-screen justify-between items-center">
	<main class="flex flex-col w-full flex-auto max-w-[18rem] sm:max-w-xl pt-20 pb-10">
		<section class="font-mono">
			<!-- Stack trace style suggestion box -->
			<div class="bg-gray-900 text-gray-200 p-4 rounded text-xs leading-relaxed mb-6">
				<!-- macOS-style window controls -->
				<div class="flex gap-2 mb-4">
					<!-- Red button - close/go back -->
					<button
						class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group cursor-pointer transition-colors"
						onclick={() => window.history.back()}
						aria-label="Go back"
					>
						<span class="hidden group-hover:block text-lg text-red-900 font-bold leading-none"
							>×</span
						>
					</button>
					<!-- Yellow button - minimize (non-functional) -->
					<button
						class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group cursor-default transition-colors"
						onclick={() => window.history.back()}
						aria-label="Minimize"
					>
						<span class="hidden group-hover:block text-lg text-yellow-900 font-bold leading-none"
							>−</span
						>
					</button>
					<!-- Green button - maximize (non-functional) -->
					<button
						class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group cursor-default transition-colors"
						onclick={() => window.history.back()}
						aria-label="Maximize"
					>
						<span class="hidden group-hover:block text-lg text-green-900 font-bold leading-none"
							>·</span
						>
					</button>
				</div>

				<!-- Terminal-style prompt -->
				<div class="text-xs mb-4">
					<span class="select-none">$</span> vi ./{status}.md
				</div>

				<!-- ASCII Art Error Code -->
				<pre class="text-xs leading-tight mb-6 overflow-x-auto select-none">{asciiArt}</pre>

				<!-- Error title -->
				<p class="mb-2"># {errorTitle}</p>
				{#if dev && error?.message}
					<p class="mb-2 text-green-700">{'<!-- '}Debug: {error.message}{' -->'}</p>
				{/if}
				<p class="mb-2 select-none">## Possible solutions:</p>
				{#if status === 404}
					<!-- Solutions for 404 errors -->
					<p class="mb-1">
						<span class="text-blue-400">1.</span> Check the URL for typos
					</p>
					<p class="mb-1">
						<span class="text-blue-400">2.</span> The page might have been moved or deleted
					</p>
					<p class="mb-1">
						<span class="text-blue-400">3.</span> Return to the home page and navigate from there
					</p>
				{:else}
					<!-- Solutions for other errors -->
					<p class="mb-1">
						<span class="text-blue-400">1.</span> Refresh the page (classic IT solution)
					</p>
					<p class="mb-1">
						<span class="text-blue-400">2.</span> Clear your cache and cookies
					</p>
					<p class="mb-1">
						<span class="text-blue-400">3.</span> Try again in a few moments
					</p>
				{/if}
			</div>
		</section>
	</main>
	<Footer />
</div>
