
## TypeScript

```shell
pnpm -Dw add typescript @types/node
```

```shell
touch tsconfig.json
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "module": "esnext",
    "target": "esnext",
    "types": [],
    "lib": ["esnext"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "verbatimModuleSyntax": false,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "exclude": ["node_modules", "dist"]
}
```

```json
// apps/backend/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "types": ["node"],
    "lib": ["esnext"]
  },
  "include": ["src"]
}
```

```json
// apps/frontend/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "types": ["node"],
    "lib": ["esnext", "DOM"]
  },
  "include": ["src"]
}
```