module.exports ={
    rules: {
        // color
        'color-named': 'never',
        'color-hex-length': 'short',
        'color-no-invalid-hex': true,
        // font
        'font-family-no-duplicate-names': true,
        // font-weight
        'font-weight-notation': "numeric",
        // number
        'number-leading-zero': 'never',
        'number-no-trailing-zeros': true,
        // string
        'string-quotes': "double",
        'string-no-newline': true,
        // length
        'length-zero-no-unit': true,
        // unit
        'unit-case': "lower",
        'unit-no-unknown': true,
        // value
        'value-keyword-case': "lower",
        'value-no-vendor-prefix': true,
        'shorthand-property-no-redundant-values': true,
        // property
        'property-case': "lower",
        'property-no-unknown': true,
        // declaration
        'declaration-block-no-duplicate-properties': [true, { ignore: ["consecutive-duplicates-with-different-values"] }],
        'declaration-block-single-line-max-declarations': 1,
        // 'declaration-block-trailing-semicolon': "never",  省略最后一条属性值后面的分号
        'declaration-colon-space-after': "always",
        'declaration-colon-space-before': "never",
        // selector
        'selector-max-compound-selectors': 3,
        'selector-attribute-quotes': "always",
        'selector-pseudo-class-case': "lower",
        'selector-pseudo-element-colon-notation': "double",
        'selector-type-no-unknown': true,
        'selector-max-empty-lines': 0,
        'selector-list-comma-space-after': "always-single-line",
        'selector-list-comma-space-before': "never",
        'selector-list-comma-newline-after': "always-multi-line",
        // block
        'block-opening-brace-space-before': "always",
        'block-opening-brace-newline-after': "always-multi-line",
        'block-closing-brace-newline-before': "always-multi-line",
        // rule
        'rule-empty-line-before': [
            "never-multi-line",
            {
                "except": [
                    "after-rule",
                    "after-single-line-comment",
                    "first-nested",
                    "inside-block-and-after-rule"
                ],
                "ignore": ["after-comment", "inside-block"]
            }
        ],
        'at-rule-no-vendor-prefix': true,
        // Sheet
        'indentation': 2,
        'max-empty-lines': 2,
        'max-nesting-depth': 3,
        'no-extra-semicolons': true,
        // function
        'function-calc-no-unspaced-operator': true,
        // 'function-comma-space-after': "never",
        'function-comma-space-before': "never",
        'function-name-case': "lower",
        'function-url-quotes': "always",
    }
}
