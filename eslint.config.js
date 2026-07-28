import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

// Flat config (eslint 9+ no longer reads .eslintrc.cjs / .eslintignore).
// Ignores are inlined here because flat config, unlike eslintrc, does not
// skip dot-directories by default — .svelte-kit and .vercel hold build output.
export default ts.config(
	{
		// Globbed with **/ so nested copies (e.g. agent worktrees under .claude/)
		// are covered too — a bare '.svelte-kit/' only matches the top level.
		ignores: [
			'**/.svelte-kit/',
			'**/.vercel/',
			'**/build/',
			'**/package/',
			'**/node_modules/',
			'.claude/',
			'.env',
			'.env.*',
			'!.env.example',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock'
		]
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				extraFileExtensions: ['.svelte'],
				svelteConfig
			}
		}
	},
	{
		// Rules newly enabled by eslint-plugin-svelte v3 / typescript-eslint v8.
		// Switched off to keep the lint baseline identical to the pre-upgrade setup
		// (only svelte/no-at-html-tags flagged anything before). Each currently has
		// real hits in src/, so turn them back on one at a time when you want to
		// work through them — counts as of this upgrade are noted below.
		rules: {
			'svelte/no-navigation-without-resolve': 'off', // 14 hits
			'svelte/require-each-key': 'off', // 8 hits
			'svelte/prefer-svelte-reactivity': 'off', // 7 hits — Set/Map -> SvelteSet/SvelteMap
			'svelte/no-reactive-literals': 'off', // 5 hits
			'svelte/no-immutable-reactive-statements': 'off', // 5 hits
			'svelte/no-useless-mustaches': 'off', // 2 hits
			'@typescript-eslint/no-unused-expressions': 'off' // 2 hits
		}
	}
);
