<script>
	import { page } from '$app/stores';
</script>

<header>
	<!-- Navigation bar -->
	<div class="flex justify-end px-5 py-4">
		<!-- home, about, and projects -->
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
			<p class="hover:font-medium" class:underline={$page.url.pathname.includes('/blog')}>
				<a href="/blog">blog</a>
			</p>
		</div>
	</div>
</header>
