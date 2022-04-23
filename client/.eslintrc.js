module.exports = {
  parser: "@babel/eslint-parser",
  extends: ["taro/react"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "jsx-quotes": ["error", "prefer-double"],
  },
};
