module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/react'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.jsx', '.js'] }
    ],
    'import/prefer-default-export': 'off',
    "jsx-a11y/control-has-associated-label": [ 2, {
      "labelAttributes": ["label"],
      "controlComponents": ["CustomComponent"],
      "ignoreElements": [
        "th",
        "input",
      ],
      "depth": 3,
    }],
    "react/state-in-constructor": 'off',
    'no-console': ['error', { allow: ['tron'] }],
    "no-console": "off",
    'react/destructuring-assignment': 'off',
    'react/no-access-state-in-setstate': 'off'
  },
};
