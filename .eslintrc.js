module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: [
        'eslint-config-airbnb',
        'standard',
    ],
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    settings: {
        "html/html-extensions": [".html", ".vue"]
    },
    env: {
        'browser': true,
        'node': true
    },
    globals: {
        '_': true,
    },
    // add your custom rules here
    rules: {
        'arrow-parens': 0,
        'generator-star-spacing': 0,
        'operator-linebreak': ["error", "before"],
        'eol-last': 0,
        'global-require': 0,
        'linebreak-style': 0,
        'semi': ["error", "never"],
        'no-underscore-dangle': 0,
        'space-before-function-paren': [0, "always"],
        'comma-dangle': ['error', 'ignore'],
        "keyword-spacing": 0,
        'indent': [2, 4, { "SwitchCase": 1 }],
        'no-new': 0,
        'no-console': 0,
        'no-unused-expressions': ["error", { "allowShortCircuit": true, "allowTernary": true }],
        'no-param-reassign': ["error", { "props": false }],
        'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
        // http://eslint.org/docs/rules/no-restricted-properties
        'no-restricted-properties': 0,
        'no-bitwise': ["error", { "allow": ["&", "|"] }],
        'no-mixed-operators': ["error", {"allowSamePrecedence": true}],
        // es6
        'no-confusing-arrow': ["error", {"allowParens": true}],

        // import
        'import/no-unresolved': 0,
        'import/extensions': [2, 'never', { "less": "always", "css": "always","jpg": "always", "png": "always" }],
        'import/first': 0,
        'import/no-dynamic-require': 0,
        'import/no-extraneous-dependencies': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
