import globals from 'globals'

export default [
  {
    files: [
      '**/*.config.{js,mjs,cjs,ts,mts,cts}',
      '**/*.server.{js,mjs,cjs,ts,mts,cts}',
      '**/scripts/**/*.{js,mjs,cjs,ts,mts,cts}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
