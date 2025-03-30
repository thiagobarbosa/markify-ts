import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-debugger': 'error',
      'no-undef': 'off',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'eqeqeq': ['error', 'always', {null: 'ignore'}],
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
]