/** @type {import('cz-git').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release'
      ]
    ]
  },
  prompt: {
    types: [
      {
        value: 'feat',
        name: '✨ 1. 新增功能: feat'
      },
      { value: 'fix', name: '🐛 2. 修复缺陷: fix' },
      { value: 'docs', name: '📚 3. 更新文档: docs' },
      {
        value: 'refactor',
        name: '📦 3. 代码重构(不新增功能也不修复bug): refactor'
      },
      {
        value: 'perf',
        name: '🚀 4. 提升性能: perf'
      },
      {
        value: 'test',
        name: '🧪 5. 添加测试: test'
      },
      {
        value: 'chore',
        name: '🔧 6. 杂活(更改构建流程或辅助工具): chore'
      },
      {
        value: 'revert',
        name: '⏪ 7. 代码回滚: revert'
      },
      {
        value: 'style',
        name: '🎨 8. 样式调整(不影响代码运行): style'
      }
    ],
    scopes: ['root', 'all-blue', 'new-world', 'docs', 'demo', 'packages'],
    allowCustomScopes: true,
    skipQuestions: ['body', 'footerPrefix', 'footer', 'breaking'], // 跳过“详细描述”和“底部信息”
    messages: {
      type: '📌 请选择提交类型:',
      scope: '🎯 请选择影响范围 (可选):',
      subject: '📝 请简要描述更改:',
      body: '🔍 详细描述 (可选):',
      footer: '🔗 关联的 ISSUE 或 BREAKING CHANGE (可选):',
      confirmCommit: '✅ 确认提交?'
    }
  }
};
