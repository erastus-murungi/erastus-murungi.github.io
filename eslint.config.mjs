import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        'eslint:recommended',
        'plugin:react/recommended',
        'next/core-web-vitals',
        'plugin:@typescript-eslint/strict',
        'plugin:unicorn/recommended',
        'plugin:jsx-a11y/recommended'
    ),
    {
        plugins: {
            react,
            reactHooks,
            jsxA11y,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.vitest,
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            'no-duplicate-imports': 'error',
            'no-await-in-loop': 'error',
            'no-console': 'error',
            'react/no-direct-mutation-state': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            '@next/next/no-img-element': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/no-nested-ternary': 'off',
            eqeqeq: 'error',
            curly: ['error', 'all'],
        },
    },
    {
        files: ['**/*.config.js', '**/*.config.ts', '**/*.config.mjs'],

        rules: {
            'import/no-anonymous-default-export': 'off',
        },
    },
];
