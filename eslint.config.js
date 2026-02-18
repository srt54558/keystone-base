import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import convex from "@convex-dev/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		files: ['src/convex/**/*.ts'],
		...convex.configs.recommended[0]
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/', 'src/convex/_generated/']
	},
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            // Add custom rules here
            '@typescript-eslint/no-explicit-any': 'off', // Common in early dev / specific convex/uploadthing usages
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'svelte/valid-compile': 'warn',
            'svelte/no-navigation-without-resolve': 'off'
        }
    }
];
