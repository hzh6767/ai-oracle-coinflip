const $ = (selector) => document.querySelector(selector);
const question = $('#question');
const tone = $('#tone');
const coin = $('#coin');
const result = $('#result');
const subresult = $('#subresult');
const history = $('#history');
const flipBtn = $('#flip');
const clearBtn = $('#clearHistory');

if (!question || !tone || !coin || !result || !subresult || !history || !flipBtn || !clearBtn) {
  console.error('Error: Required elements missing in DOM. Check element ids in index.html');
}

const { verdicts, pick, truncatePrompt } = typeof module !== 'undefined' && module.exports
  ? require('./oracle.js')
  : window;
function addHistory(text) {
  if (!history) return;
  const empty = history.querySelector('.empty');
  if (empty) empty.remove();
  const item = document.createElement('li');
  item.textContent = text;
  history.prepend(item);
  while (history.children.length > 5) history.lastElementChild.remove();
}

if (flipBtn) {
  flipBtn.addEventListener('click', () => {
    const prompt = (question?.value || '').trim() || '一个还没说出口的问题';
    const side = Math.random() > .5 ? 'yes' : 'no';
    const face = side === 'yes' ? 'YES' : 'NO';
    if (coin) {
      coin.classList.remove('flipping');
      void coin.offsetWidth;
      coin.classList.add('flipping');
      coin.textContent = face;
      coin.setAttribute('aria-label', `硬币结果：${face}`);
    }
    if (result) {
      result.textContent = pick(verdicts[tone?.value || 'kind'][side]);
    }
    if (subresult) {
      subresult.textContent = `关于“${truncatePrompt(prompt)}”的判词`;
    }
    addHistory(`${face === 'YES' ? '是' : '否'} · ${prompt}`);
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (!history) return;
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = '还没有判词，先抛一次吧。';
    history.replaceChildren(empty);
  });
}
