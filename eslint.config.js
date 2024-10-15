import tsEslint from 'typescript-eslint'
import jsEslint from '@eslint/js'
import globals from 'globals'

export default tsEslint.config(
    {
        files: ['**/*.{js,ts,tsx}'],
        ignores: ['dist', 'vite.config.ts'],
        extends: [jsEslint.configs.recommended, ...tsEslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            "indent": ["error", 4],
        }
    }
)