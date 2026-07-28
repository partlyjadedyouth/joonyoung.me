<!--
	ProfileContainer.svelte
	Composes the homepage identity block: name, affiliation, short biography, and
	social/contact links. The email link is decoded client-side, while the rest of the
	links are stored in a single array so ordering and separators stay consistent.
-->

<script>
	import ObfuscatedEmail from '$lib/components/ObfuscatedEmail.svelte';
	import { PRIMARY_EMAIL_DOMAIN_CODES, PRIMARY_EMAIL_USER_CODES } from '$lib/data/contact';

	// import email from '$lib/images/email.svg';
	// import github from '$lib/images/github-mark.svg';
	// import linkedin from '$lib/images/linkedin.png';
	// import cv from '$lib/images/cv.png';

	const socialLinks = [
		{ href: '/about', label: 'CV', external: true },
		{ label: 'Email', obfuscated: true },
		{
			href: 'https://www.linkedin.com/in/joonyoung-park-487136185',
			label: 'LinkedIn',
			external: true
		},
		{ href: 'https://github.com/partlyjadedyouth', label: 'GitHub', external: true },
		{
			href: 'https://scholar.google.com/citations?user=c2MDDjoAAAAJ',
			label: 'Google Scholar',
			external: true
		}
	];
</script>

<!-- Identity header introduces the researcher before the longer biography below. -->
<section class="flex flex-col items-start mb-7">
	<!-- Profile pic -->
	<!-- Re-enabling this needs @sveltejs/enhanced-img reinstalled and re-added to vite.config.ts;
	     it was dropped since nothing rendered it and it pulled a vulnerable sharp/libvips. -->
	<!-- <enhanced:img alt="profile pic" src="$lib/images/profile.png" class="w-36 rounded-full" /> -->
	<!-- Name and affiliation links remain compact so they work as the page's opening signature. -->
	<h1 class="font-semibold font-mono text-2xl">Joonyoung Park</h1>
	<div class="font-medium font-ibm">
		Ph.D. Student @
		<a
			href="https://dxd-lab.github.io"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline inline-block"
		>
			DxD Lab
		</a>, KAIST
	</div>
</section>

<!-- Self-introduction paragraphs mix static text with outbound academic and personal references. -->
<section class="flex flex-col font-ibm font-light text-md hyphens-auto mb-7">
	<p class="mb-3">
		I am an HCI researcher and a Ph.D. student in the
		<a
			href="https://id.kaist.ac.kr"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline"
		>
			Department of Industrial Design
		</a>
		at
		<a
			href="https://kaist.ac.kr"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline inline-block"
		>
			KAIST
		</a>, where I am working with
		<a
			href="https://galaxytourist.notion.site/Hwajung-Hong-cc10b0291bbe4ca38dbf4882cd687423"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline"
		>
			Prof. Hwajung Hong
		</a>.
	</p>
	<p class="mb-3">
		My research interests lie at the intersection of Human-Computer Interaction (HCI), Human-AI
		Interaction (HAI), and AI-mediated communication. Specifically, I aim to explore ways to improve
		technological accessibility and create new opportunities for marginalized people through
		multi-modal and cross-modal interactions.
	</p>
	<p class="mb-3">
		Prior to my graduate studies, I received a B.S. in
		<a
			href="https://ece.snu.ac.kr"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline"
		>
			Electrical & Computer Engineering
		</a>
		and a B.A. in
		<a
			href="https://isc.snu.ac.kr"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline"
		>
			Information Science and Culture Studies
		</a>
		from
		<a
			href="https://snu.ac.kr"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline inline-block"
		>
			Seoul National University
		</a>.
	</p>
	<p>
		Personally, I love listening to music, both at home and at live concerts. Check out my
		<a
			href="https://rateyourmusic.com/~Proshuto"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline inline-block"
		>
			RYM profile
		</a>
		to see the albums I've been exploring. I also occasionally take
		<a
			href="https://www.instagram.com/partlyjadedyesterdays"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium hover:underline inline-block"
		>
			film photographs
		</a>
		with my grandfather's Pentax.
	</p>
</section>

<!-- Social link row renders separators between items and swaps in ObfuscatedEmail for the contact entry. -->
<section class="flex flex-wrap items-center gap-x-2 gap-y-0 font-ibm font-light">
	{#each socialLinks as link, i (`${link.label}-${link.href ?? 'obfuscated-email'}`)}
		{#if link.obfuscated}
			<ObfuscatedEmail
				userCodes={PRIMARY_EMAIL_USER_CODES}
				domainCodes={PRIMARY_EMAIL_DOMAIN_CODES}
				className="hover:underline"
				label={link.label}
			>
				{link.label}
			</ObfuscatedEmail>
		{:else}
			<a
				href={link.href}
				target={link.external ? '_blank' : undefined}
				rel={link.external ? 'noopener noreferrer' : undefined}
				class="hover:underline"
			>
				{link.label}
			</a>
		{/if}

		{#if i !== socialLinks.length - 1}
			<span aria-hidden="true">|</span>
		{/if}
	{/each}
</section>
