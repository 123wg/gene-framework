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
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    // 对于所有类型，要求以 T_ 开头
                    "selector": 'typeAlias',
                    "format": ['PascalCase'],
                    "prefix": ['T_'],
                },
                {
                    // 对于接口，要求以 I_ 开头
                    "selector": 'interface',
                    "format": ['PascalCase'],
                    "prefix": ['I_'],
                },
                {
                    // 对于枚举，要求以 EN_ 开头
                    "selector": 'enum',
                    "format": ['PascalCase'],
                    "prefix": ['EN_'],
                },
            ],
            'semi': ['error', 'always'], // 强制使用分号
        }
    }
)