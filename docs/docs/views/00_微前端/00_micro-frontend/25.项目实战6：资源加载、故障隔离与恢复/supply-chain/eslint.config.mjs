import baseConfig from '@supply-chain/eslint-config/base'
import nodeConfig from '@supply-chain/eslint-config/node'
import reactConfig from '@supply-chain/eslint-config/react'
import vueConfig from '@supply-chain/eslint-config/vue'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.pnpm-store/**',
      '**/pnpm-lock.yaml',
    ],
  },
  ...baseConfig,
  ...vueConfig,
  ...reactConfig,
  ...nodeConfig,
  {
    files: ['apps/api-server/**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
]
