const test = require('node:test');
const assert = require('node:assert');
const { VERDICT_CAP, PROMPT_MAX, verdicts, pick, truncatePrompt, pushHistory } = require('../oracle.js');

test('判词表覆盖三种气质与是/否两侧', () => {
  assert.deepStrictEqual(Object.keys(verdicts), ['absurd', 'kind', 'serious']);
  for (const tone of Object.keys(verdicts)) {
    for (const side of ['yes', 'no']) {
      const list = verdicts[tone][side];
      assert.ok(Array.isArray(list) && list.length > 0, `${tone}.${side} 应为非空数组`);
      for (const text of list) {
        assert.strictEqual(typeof text, 'string');
        assert.ok(text.trim().length > 0, `${tone}.${side} 不应包含空判词`);
      }
    }
  }
});

test('pick 依据给定随机数选择元素', () => {
  const list = ['a', 'b', 'c'];
  assert.strictEqual(pick(list, () => 0), 'a');
  assert.strictEqual(pick(list, () => 0.5), 'b');
  assert.strictEqual(pick(list, () => 0.999), 'c');
});

test('pick 只返回表内元素', () => {
  const list = verdicts.absurd.yes;
  for (let i = 0; i < 200; i += 1) {
    assert.ok(list.includes(pick(list)), '取出的判词必须来自原列表');
  }
});

test('truncatePrompt 仅在超出上限时截断并补省略号', () => {
  assert.strictEqual(truncatePrompt('短问题'), '短问题');
  const exact = 'x'.repeat(PROMPT_MAX);
  assert.strictEqual(truncatePrompt(exact), exact);
  const overflow = 'x'.repeat(PROMPT_MAX + 1);
  assert.strictEqual(truncatePrompt(overflow), 'x'.repeat(PROMPT_MAX) + '…');
  assert.strictEqual(truncatePrompt(overflow).length, PROMPT_MAX + 1);
});

test('truncatePrompt 不拆开组合字符与代理对', () => {
  const cluster = 'é';
  const text = 'x'.repeat(PROMPT_MAX - 1) + cluster + 'y';
  const out = truncatePrompt(text);
  assert.strictEqual(out, 'x'.repeat(PROMPT_MAX - 1) + cluster + '…');
  const astral = '\u{1F600}'.repeat(PROMPT_MAX + 1);
  const astralOut = truncatePrompt(astral);
  assert.strictEqual(Array.from(astralOut).length, PROMPT_MAX + 1);
  assert.ok(astralOut.endsWith('…'));
});

test('pushHistory 新的在前且不超过上限', () => {
  let items = [];
  for (let i = 1; i <= VERDICT_CAP + 3; i += 1) items = pushHistory(items, `第 ${i} 条`);
  assert.strictEqual(items.length, VERDICT_CAP);
  assert.deepStrictEqual(items, ['第 8 条', '第 7 条', '第 6 条', '第 5 条', '第 4 条']);
});

test('pushHistory 不修改传入的数组', () => {
  const before = ['旧判词'];
  const after = pushHistory(before, '新判词');
  assert.deepStrictEqual(before, ['旧判词']);
  assert.deepStrictEqual(after, ['新判词', '旧判词']);
});

test('pushHistory 支持自定义上限', () => {
  assert.deepStrictEqual(pushHistory(['b', 'c'], 'a', 2), ['a', 'b']);
});
