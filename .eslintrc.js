const baseTypescript = {
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-prototype-builtins': 'off',
    'no-plusplus': 'off',
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.spec.ts',
          '**/*.spec.tsx',
          '**/*.stories.tsx',
          '**/fixtures.ts',
          '**/setupTests.ts',
          './*.ts',
          './*.js',
        ],
      },
    ],
    // Makes no sense to allow type inference for expression parameters, but require typing the response
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true, allowTypedFunctionExpressions: true },
    ],
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }],
    // note you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'class-methods-use-this': 'off',
    // Non-null assertion operator makes strict typechecking useless
    '@typescript-eslint/no-non-null-assertion': 'error',
    // TypeScript handles it better
    'consistent-return': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'tsdoc/syntax': 'warn',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}

module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      ...baseTypescript,
    },
    {
      files: ['src/cdk/**/*.ts*', 'src/features/**/*.ts*', 'src/django-spa/components/**/*.ts*'],
      ...baseTypescript,
      rules: {
        ...baseTypescript.rules,
        '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
      },
    },
    {
      files: ['src/features/**/*.ts*'],
      ...baseTypescript,
    },
    {
      files: ['src/**/*.stories.ts*'],
      ...baseTypescript,
      rules: {
        ...baseTypescript.rules,
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/fixtures.ts*'],
      ...baseTypescript,
      rules: {
        ...baseTypescript.rules,
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      },
    },
  ],
}
