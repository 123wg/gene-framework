import tsEslint from 'typescript-eslint'
import jsEslint from '@eslint/js'
import globals from 'globals'

export default tsEslint.config(
    {
        files: ['**/*.{js,ts,tsx}'],
        ignores: ['dist'],
        extends: [jsEslint.configs.recommended, ...tsEslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            // "indent": ["warn", 4, { "FunctionDeclaration": { "body": 2, "parameters": 2 }, "SwitchCase": 1 }],
        }
    }
)