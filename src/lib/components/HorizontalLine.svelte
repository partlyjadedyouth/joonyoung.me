<!--
	HorizontalLine.svelte
	Renders a reusable one-pixel horizontal divider whose width, vertical spacing,
	and color can be controlled by parent pages. The component accepts either
	Tailwind-style class fragments, such as "w-full" or "bg-black", or simple values
	that are converted into the matching Tailwind utility classes.
-->

<script lang="ts">
	export let w = '32';
	export let my = '0';
	export let color = 'black';

	let widthClass: string;
	let marginClass: string;
	let colorClass: string;
	let backgroundColor: string | undefined;
	$: widthClass = w.startsWith('w-') ? w : `w-${w}`;
	$: marginClass = my.startsWith('my-') ? my : `my-${my}`;
	$: {
		if (color.startsWith('bg-')) {
			colorClass = color;
			backgroundColor = undefined;
		} else {
			colorClass = '';
			backgroundColor = color;
		}
	}
</script>

<!--
	The visible divider stays centered and borderless. Inline background color is only
	used when the caller passes a raw CSS color instead of a Tailwind background class.
-->
<hr
	class={`mx-auto h-px border-0 ${widthClass} ${marginClass} ${colorClass}`}
	style:background-color={backgroundColor}
/>
