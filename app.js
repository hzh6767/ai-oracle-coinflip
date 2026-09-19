const $ = (selector) => document.querySelector(selector);
const question = $('#question');
const tone = $('#tone');
const coin = $('#coin');
const result = $('#result');
const subresult = $('#subresult');
const history = $('#history');

const verdicts = {
  absurd: {
    yes: ['当然要！宇宙已经替你把购物车加购了。', '是的，理由是今天的云长得像一只同意的鸭子。', '冲吧。最坏的结果是你得到一个精彩的故事。'],
    no: ['先别。你的未来版本正在礼貌地摇头。', '不建议，除非你能用三根胡萝卜解释它。', '今天的命运按钮卡住了，明天再试一次。']
  },
  kind: {
    yes: ['可以试试。你已经想了这么久，心里其实有答案。', '倾向于可以，记得给自己留一点轻松的空间。', '去做吧，小步也算前进。'],
    no: ['先缓一缓也很好，你不需要现在做决定。', '今天可以对自己温柔一点，暂缓也是选择。', '不做也没关系，休息同样有价值。']
  },
  serious: {
    yes: ['倾向：是。预计收益略高于成本。', '结论：可以执行，建议设置一个小型止损线。', '判断：是。请用可逆的小步骤开始。'],
    no: ['倾向：否。当前信息不足以支持行动。', '结论：暂缓，先补充关键事实。', '判断：否。建议 24 小时后重新评估。']
  }
};

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
function addHistory(text) {
  const empty = history.querySelector('.empty');
  if (empty) empty.remove();
  const item = document.createElement('li');
  item.textContent = text;
  history.prepend(item);
  while (history.children.length > 5) history.lastElementChild.remove();
}

$('#flip').addEventListener('click', () => {
  const prompt = question.value.trim() || '一个还没说出口的问题';
  const side = Math.random() > .5 ? 'yes' : 'no';
  const face = side === 'yes' ? 'YES' : 'NO';
  coin.classList.remove('flipping');
  void coin.offsetWidth;
  coin.classList.add('flipping');
  coin.textContent = face;
  coin.setAttribute('aria-label', `硬币结果：${face}`);
  result.textContent = verdicts[tone.value][side][Math.floor(Math.random() * verdicts[tone.value][side].length)];
  subresult.textContent = `关于“${prompt.length > 54 ? prompt.slice(0, 54) + '…' : prompt}”的判词`;
  addHistory(`${face === 'YES' ? '是' : '否'} · ${prompt}`);
});

$('#clearHistory').addEventListener('click', () => {
  const empty = document.createElement('li');
  empty.className = 'empty';
  empty.textContent = '还没有判词，先抛一次吧。';
  history.replaceChildren(empty);
});
