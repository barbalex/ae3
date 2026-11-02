import pluginReactRefresh from 'eslint-plugin-react-refresh'
import pluginImport from 'eslint-plugin-import'
import { fixupConfigRules } from '@eslint/compat'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['**/dist', '**/node_modules/'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      // 'plugin:@typescript-eslint/recommended',
      // 'plugin:@typescript-eslint/stylistic',
      // 'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ),
  ),
  {
    plugins: {
      'react-refresh': pluginReactRefresh,
      import: pluginImport,
    },

    settings: {
      // teach the import resolver the extensions this project resolves
      // (matches vite's bundler resolution; keeps import/extensions
      // quiet about extensionless local imports)
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
        },
      },
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      strict: 0,
      'react/display-name': 'off',
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

      'react/react-in-jsx-scope': 'off',

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      'import/extensions': [
        'warn',
        'ignorePackages',
        {
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
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
    files: ['*.config.ts', 'scripts/**/*.ts', 'e2e/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
