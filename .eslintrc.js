module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:import/typescript",
        "prettier"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "unused-imports", "import", "jsdoc"],
    rules: {
        "jsdoc/check-param-names": "error",
        "@typescript-eslint/no-namespace": "off",
        "unused-imports/no-unused-imports-ts": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "import/no-relative-packages": "error"
    },
    env: {
        es6: true,
        jest: true,
        node: true,
    },
};
