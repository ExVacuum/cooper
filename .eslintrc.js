module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'no-console': 0,
    'no-plusplus': 0,
    'no-bitwise': 0,
    'no-param-reassign': ['error', { props: false }],
    'no-await-in-loop': 0,
  },
};
