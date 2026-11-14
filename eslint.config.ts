import pluginReactRefresh from 'eslint-plugin-react-refresh'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import js from '@eslint/js'

export default [
  {
    ignores: ['**/dist', '**/node_modules/'],
  },
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    plugins: {
      'react-refresh': pluginReactRefresh,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      strict: 0,
      'no-console': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prefer-const': 'warn',
      'no-unused-vars': 'off',

      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
    },
  },
  {
    // typescript files: same rules, but parsed with the ts parser;
    // no-undef is a soundness check for plain js — ts itself checks
    // that type/global names exist
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    // root config files, scripts and e2e specs run in node, not the browser
    files: ['*.config.ts', 'scripts/**/*.{ts,mjs}', 'e2e/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
