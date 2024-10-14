module.exports = {
    root: true, // 表示这是根配置
    parser: '@typescript-eslint/parser', // 使用 TypeScript 解析器
    parserOptions: {
      ecmaVersion: "latest", // ECMAScript 版本
      sourceType: 'module', // 允许使用 ES6 模块
    },
    plugins: ['@typescript-eslint'], // 添加 TypeScript 插件
    extends: [
      'eslint:recommended', // 使用推荐规则
      'plugin:@typescript-eslint/recommended', // 使用 TypeScript 推荐规则
    ],
    rules: {
        'indent': ['error', 4], // 传统 JavaScript 规则
    },
};
