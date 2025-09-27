import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default withNuxt({
  plugins: {
    vue: eslintPluginVue,
    prettier: eslintPluginPrettier
  },
  ignores: [
    '**/.nuxt/**',
    '**/.output/**',
    '**/dist/**',
    '**/node_modules/**',
    '**/public/**'
  ],
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'comma-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off',
    'vue/require-default-prop': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        endOfLine: 'lf',
        quoteProps: 'consistent',
        trailingComma: 'none'
      }
    ]
  }
})
