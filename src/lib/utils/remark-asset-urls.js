import { visit } from 'unist-util-visit';

/** @typedef {{ type: string, children?: unknown[] }} Root */
/** @typedef {{ type: string, url?: string, alt?: string, title?: string, value?: string }} Image */

/** @param {string | undefined | null} value */
const isRelativeUrl = (value) => value && !/^([a-z]+:|\/)/i.test(value);

/** @param {string} value */
const escapeAttr = (value) =>
	String(value)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

export function remarkAssetUrls() {
	/** @param {Root} tree */
	return (tree) => {
		/** @type {string[]} */
		const imports = [];

		visit(tree, 'image', /** @param {Image} node */ (node) => {
			if (!isRelativeUrl(node.url)) {
				return;
			}

			// Imported asset URLs resolve identically during SSR and in the browser,
			// unlike `new URL(..., import.meta.url)`, which yields file:// paths on the server.
			const name = `__asset${imports.length}`;
			imports.push(`import ${name} from '${node.url}';`);

			const alt = escapeAttr(node.alt || '');
			const title = node.title ? ` title="${escapeAttr(node.title)}"` : '';

			node.type = 'html';
			node.value = `<img src={${name}} alt="${alt}"${title} />`;
			delete node.url;
			delete node.alt;
			delete node.title;
		});

		if (imports.length > 0) {
			tree.children?.unshift({ type: 'html', value: `<script>\n${imports.join('\n')}\n</script>` });
		}
	};
}
