import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import unicornPlugin from 'eslint-plugin-unicorn';
import nextPlugin from '@next/eslint-plugin-next';

export default [
    js.configs.recommended,
    ...tseslint.configs.strict,
    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
            unicorn: unicornPlugin,
            '@next/next': nextPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.vitest,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // React rules
            ...reactPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off', // Not needed in Next.js
            'react/no-direct-mutation-state': 'error',

            // React Hooks rules
            ...reactHooksPlugin.configs.recommended.rules,
            'react-hooks/exhaustive-deps': 'warn',

            // JSX A11y rules
            ...jsxA11yPlugin.configs.recommended.rules,

            // Unicorn rules
            ...unicornPlugin.configs.recommended.rules,
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/no-nested-ternary': 'off',

            // Next.js rules
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
            '@next/next/no-img-element': 'off',

            // General rules
            'no-duplicate-imports': 'error',
            'no-await-in-loop': 'error',
            'no-console': 'error',
            eqeqeq: 'error',
            curly: ['error', 'all'],

            // Disable prop-types for TypeScript files
            'react/prop-types': 'off',
        },
    },
    {
        files: ['**/*.config.js', '**/*.config.ts', '**/*.config.mjs'],
        rules: {
            'import/no-anonymous-default-export': 'off',
        },
    },
];
