# AI 命运硬币

一个无需联网的静态趣味小工具：输入问题，选择回答气质，让随机硬币给出带一点 AI 口吻的命运判词。

## 运行

直接双击 `index.html`，或在本目录执行：

```bash
npm run check  # 检查 JavaScript 语法
npm test       # 运行核心逻辑的单元测试
```

项目不需要安装依赖、不需要 API key。

## 文件

- `index.html`：页面结构与可访问表单
- `style.css`：响应式视觉样式
- `app.js`：随机判词、动画与历史记录
- `oracle.js`：可测试的核心逻辑（判词库、pick、历史截断）
- `tests/oracle.test.js`：单元测试
- `package.json`：本地静态检查与测试命令

## 许可

MIT，详见 `LICENSE`。
