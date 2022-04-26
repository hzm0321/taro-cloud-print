module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["taro/react"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "jsx-quotes": ["error", "prefer-double"],
    "@typescript-eslint/no-unused-vars": [2],
  },
};
