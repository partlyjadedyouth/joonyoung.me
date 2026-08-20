<!--
	+page.svelte
	Renders the CV-style about page with contact details, education, experience,
	publications, teaching, service, and awards. Publication data is grouped by year
	in the script block so the markup can focus on section structure and styling.
-->

<script lang="ts">
	import emailIcon from '$lib/images/email.svg';
	import browser from '$lib/images/browser.png';
	import linkedin from '$lib/images/linkedin.png';
	import awardIcon from '$lib/images/award.png';
	import LinkContainer from '$lib/components/LinkContainer.svelte';
	import ObfuscatedEmail from '$lib/components/ObfuscatedEmail.svelte';
	import HorizontalLine from '$lib/components/HorizontalLine.svelte';
	import { PRIMARY_EMAIL_DOMAIN_CODES, PRIMARY_EMAIL_USER_CODES } from '$lib/data/contact';
	import { publications } from '$lib/data/publications';

	// Split author strings so the site owner's name can be highlighted wherever it appears.
	const highlightedName = 'Joonyoung Park';
	const splitAuthors = (authors: string) => authors.split(highlightedName);
	const authorSegments = (authors: string) => {
		const parts = splitAuthors(authors);
		return parts.map((part: string, index: number) => ({
			part,
			highlight: index < parts.length - 1
		}));
	};

	// Group publications by year once, then render years newest-first in the page body.
	const groupedPublications = publications.reduce<Record<string, typeof publications>>(
		(acc, publication) => {
			const year = publication.year?.toString() ?? 'Other';
			if (!acc[year]) acc[year] = [];
			acc[year].push(publication);
			return acc;
		},
		{}
	);
	const sortedPublicationYears = Object.keys(groupedPublications).sort((a, b) => {
		if (a === 'Other') return 1;
		if (b === 'Other') return -1;
		return Number(b) - Number(a);
	});
</script>

<svelte:head>
	<title>about | joonyoung park</title>
	<meta
		name="description"
		content="About Joonyoung Park — Ph.D. student at DxD Lab, KAIST. Background, CV, and research in human-AI interaction and HCI."
	/>
</svelte:head>

<!-- Contact header gives visitors quick access to the CV, website, email, and LinkedIn profile. -->
<section class="pt-20">
	<!-- Name -->
	<div class="flex">
		<h1 class="font-mono text-2xl font-semibold mr-2">Joonyoung Park</h1>
		<LinkContainer type="pdf" url="/pdfs/cv.pdf" />
	</div>

	<div class="flex flex-col">
		<!-- Website -->
		<a
			href="https://joonyoung.me"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-end gap-x-1.5"
		>
			<img
				alt="Browser icons created by kmg design - Flaticon"
				src={browser}
				class="w-5 h-5 align-middle"
			/>
			<span class="font-ibm hover:font-medium hover:underline">joonyoung.me</span>
		</a>
		<!-- Email -->
		<ObfuscatedEmail
			userCodes={PRIMARY_EMAIL_USER_CODES}
			domainCodes={PRIMARY_EMAIL_DOMAIN_CODES}
			className="inline-flex items-end gap-x-1.5"
			let:email
			let:isReady
		>
			<img alt="email" src={emailIcon} class="w-5 h-5 align-middle" />
			<span class="font-ibm hover:font-medium hover:underline">{isReady ? email : 'Email'}</span>
		</ObfuscatedEmail>
		<!-- LinkedIn -->
		<a
			href="https://www.linkedin.com/in/joonyoung-park-487136185"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-start gap-x-1.5 mt-0.5"
		>
			<img alt="LinkedIn" src={linkedin} class="w-5 h-5 align-middle" />
			<span class="font-ibm hover:font-medium hover:underline">Joonyoung Park</span>
		</a>
	</div>
</section>

<!-- Education section lists degree history in reverse chronological order. -->
<section class="mt-10 font-ibm">
	<h1 class="text-2xl font-medium">EDUCATION</h1>
	<!-- KAIST -->
	<div class="mt-2">
		<b class="font-medium">
			<a
				href="https://kaist.ac.kr"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:underline"
			>
				KAIST
			</a>
		</b>, Daejeon, Republic of Korea
	</div>
	<div class="font-light">Ph.D., Industrial Design</div>
	<div class="font-light text-sm italic">
		Advisor: <a
			href="https://galaxytourist.notion.site/Hwajung-Hong-cc10b0291bbe4ca38dbf4882cd687423"
			target="_blank"
			rel="noopener noreferrer"
			class="hover:underline"
		>
			Hwajung Hong
		</a>
	</div>
	<div class="font-extralight text-sm">Feb 2025 - Present</div>
	<!-- SNU -->
	<div class="mt-2">
		<b class="font-medium">
			<a href="https://snu.ac.kr" target="_blank" rel="noopener noreferrer" class="hover:underline">
				Seoul National University
			</a>
		</b>, Seoul, Republic of Korea
	</div>
	<div class="font-light">
		B.S., Electrical and Computer Engineering<br />
		B.A., Information Science and Culture Studies
	</div>
	<div class="font-extralight text-sm">Mar 2017 - Feb 2025 *</div>
	<div class="font-extralight text-sm">* includes a 2-year mandatory military service</div>
</section>

<!-- Research and work experience section summarizes lab and industry roles. -->
<section class="mt-10 font-ibm">
	<h1 class="text-2xl font-medium">RESEARCH & WORK EXPERIENCE</h1>

	<div class="mt-2">
		<a href="http://hcid.snu.ac.kr/" target="_blank" rel="noopener noreferrer">
			<b class="font-medium hover:underline"> HCI+d Lab, </b>
		</a> Seoul National University
	</div>
	<div class="font-light">Undergraduate Research Intern</div>
	<div class="font-light text-sm italic">
		Advisor: <a
			href="https://www.hajinlim.com/"
			target="_blank"
			rel="noopener noreferrer"
			class="hover:underline"
		>
			Hajin Lim
		</a>
	</div>
	<div class="font-extralight text-sm">Jan 2024 - Dec 2024</div>

	<div class="mt-3">
		<b class="font-medium hover:underline">
			<a href="https://www.samsungsem.com/" target="_blank" rel="noopener noreferrer">
				Samsung Electro-Mechanics
			</a>
		</b>, Suwon, Republic of Korea
	</div>
	<div class="font-light">Undergraduate Intern</div>
	<div class="font-extralight text-sm">Jul 2019 - Aug 2019</div>
</section>

<!-- Publications are grouped by year, with horizontal dividers visually separating each group. -->
<section class="mt-10 font-ibm">
	<h1 class="text-2xl font-medium">PUBLICATIONS</h1>

	{#each sortedPublicationYears as year}
		<!-- Year label acts as the heading for all publications in that group. -->
		<div class="mt-2 flex items-center">
			<h2 class="font-medium">{year}</h2>
			<div class="ml-4 flex-1">
				<HorizontalLine w="full" my="0" color="bg-black" />
			</div>
		</div>
		{#each groupedPublications[year] as publication}
			<!-- Titles become external links only when the publication data includes an href. -->
			{#if publication.href}
				<div class="mt-2 hover:underline">
					<a href={publication.href} target="_blank" rel="noopener noreferrer">
						{publication.title}
					</a>
				</div>
			{:else}
				<div class="mt-2">{publication.title}</div>
			{/if}
			<div class="font-light text-sm italic">
				<!-- Author segments preserve the original text while underlining Joonyoung Park. -->
				{#each authorSegments(publication.authors) as segment}
					{segment.part}
					{#if segment.highlight}
						<u><b>{highlightedName}</b></u>
					{/if}
				{/each}
			</div>
			<div class="font-light text-sm {!publication.award && 'mb-5'}">{publication.venue}</div>
			{#if publication.award}
				<!-- Award callout appears inline with an icon for recognized papers. -->
				<div class="font-regular text-sm flex items-center gap-1 mb-5">
					<img src={awardIcon} alt="Award" class="h-4" />
					<span>{publication.award}</span>
				</div>
			{/if}
		{/each}
	{/each}
</section>

<!-- Teaching section separates mentoring and course-assistant responsibilities. -->
<section class="mt-10 font-ibm">
	<h1 class="text-2xl font-medium">TEACHING EXPERIENCE</h1>

	<!-- Mentor -->
	<div class="mt-2">
		<b class="font-medium">Graduate Mentor for URP Program, </b> KAIST
		<div class="font-light text-sm italic">Mentee: Hyunji Huh (ID KAIST)</div>
		<div class="font-extralight text-sm">Spring 2026</div>
	</div>
	<div class="mt-2">
		<b class="font-medium">Graduate Teaching Assistant, </b> KAIST
		<div class="font-light mr-1 text-sm">
			Design Thinking for Startup (KEI560) <span class="font-extralight">
				Spring 2025 - Spring 2026</span
			>
		</div>
		<div class="font-light mr-1 text-sm">
			Photo Techniques (ID218) <span class="font-extralight"> Fall 2025</span>
		</div>
	</div>
</section>

<!-- Academic service section records reviewing work without adding extra visual weight. -->
<section class="mt-10 font-ibm">
	<h1 class="text-2xl font-medium">ACADEMIC SERVICES</h1>

	<!-- Reviewer -->
	<div class="mt-2 flex items-center">
		<h2 class="font-medium">Reviewer</h2>
		<!-- <div class="ml-4 flex-1">
			<HorizontalLine w="full" my="0" color="bg-black/20" />
		</div> -->
	</div>
	<div class="font-light mr-1 text-sm">ACM CHI <span class="font-extralight"> 2025-2026</span></div>
	<div class="font-light mr-1 text-sm">ACM DIS <span class="font-extralight"> 2025-2026</span></div>
</section>

<!-- Awards and honors section lists recognitions with short explanatory subtitles. -->
<section class="mt-10 font-ibm">
	<h1 class="text-2xl font-medium">AWARDS & HONORS</h1>

	<div class="mt-2">
		<b class="font-medium">Honorable Mention Award</b>, ACM CHI
	</div>
	<div class="font-light text-sm italic">
		Selected among the top 5% of the full paper submissions
	</div>
	<div class="font-extralight text-sm">2026</div>

	<div class="mt-2">
		<b class="font-medium">Student-Directed Education Grant</b>, Seoul National University
	</div>
	<div class="font-light text-sm italic">
		Awarded a research grant for an outstanding undergraduate research proposal
	</div>
	<div class="font-extralight text-sm">2024</div>

	<div class="mt-2">
		<b class="font-medium">Merit-Based Scholarship</b>, Seoul National University
	</div>
	<div class="font-light text-sm italic">Undergraduate merit-based scholarship (10%)</div>
	<div class="font-extralight text-sm">2017</div>
</section>

<section class="pb-20"></section>
