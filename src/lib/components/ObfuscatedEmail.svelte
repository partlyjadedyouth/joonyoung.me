<!--
	ObfuscatedEmail.svelte
	Builds a mailto link on the client from character-code arrays so the raw email
	address is not present in the initial HTML. Consumers can either use the default
	link text or provide a slot that reacts to the decoded email and readiness state.
-->

<script lang="ts">
	import { onMount } from 'svelte';

	export let userCodes: number[] = [];
	export let domainCodes: number[] = [];
	export let label = 'Email';
	export let className = '';
	export let target = '_blank';
	export let rel = 'noopener noreferrer';

	let email = '';
	let href = '';

	const decode = (codes: number[]) => String.fromCharCode(...codes);

	onMount(() => {
		const user = decode(userCodes);
		const domain = decode(domainCodes);
		email = `${user}@${domain}`;
		href = `mailto:${email}`;
	});
</script>

<!--
	The href is intentionally omitted until onMount decodes the address in the browser.
	The slot receives both the decoded email and a boolean so parent components can
	render a placeholder label before the link is ready.
-->
<a href={href || undefined} {target} {rel} class={className}>
	<slot {email} isReady={Boolean(email)}>{email || label}</slot>
</a>
