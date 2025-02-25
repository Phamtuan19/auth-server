module.exports = {
   root: true,
   env: { node: true },
   extends: ['eslint:recommended', 'prettier'],
   ignorePatterns: ['.eslintrc.cjs', '*.config.js', '*.config.ts', '*.slice.ts', '*.config.cjs', 'additional.d.ts'],

   overrides: [
      {
         files: ['*.ts', '*.tsx'],
         extends: [
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-type-checked',
            'plugin:import/typescript',
            'prettier',
         ],
         parser: '@typescript-eslint/parser',
         parserOptions: {
            project: ['./tsconfig.json', './tsconfig.node.json'],
            tsconfigRootDir: __dirname,
         },
         rules: {
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            // '@typescript-eslint/naming-convention': [
            //    'error',
            //    {
            //       selector: 'default',
            //       format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            //       leadingUnderscore: 'allow',
            //    },
            //    {
            //       selector: 'variable',
            //       types: ['boolean'],
            //       format: ['PascalCase'],
            //       prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
            //    },
            //    {
            //       selector: 'typeLike',
            //       format: ['PascalCase'],
            //    },
            //    {
            //       selector: 'parameter',
            //       format: ['camelCase'],
            //    },
            // ],
         },
      },
      {
         files: ['.eslintrc.cjs'],
         rules: {
            'prettier/prettier': 'off',
         },
      },
   ],
   rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-extra-semi': 'error',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'no-trailing-spaces': 'error',
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'always'],
      'arrow-spacing': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'eol-last': ['error', 'always'],
      'import/no-extraneous-dependencies': [
         'error',
         {
            devDependencies: true,
            optionalDependencies: false,
            peerDependencies: false,
            packageDir: './',
         },
      ],
      // 'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
      'import/order': ['error', { 'newlines-between': 'always' }],
      'import/prefer-default-export': 'off',
   },
   plugins: ['import'],
};
