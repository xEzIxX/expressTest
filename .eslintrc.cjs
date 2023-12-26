module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard', 
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    "eqeqeq": "off",
    "curly": "error",
    "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}]
  }
}
