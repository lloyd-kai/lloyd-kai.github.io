document.addEventListener('DOMContentLoaded', function () {
  const hint = '输入QQ号会自动获取昵称和头像';

  const setNickPlaceholder = function () {
    const input = document.querySelector('#twikoo input[name="nick"], #twikoo .tk-meta-input:nth-child(1) input');
    if (!input) return false;
    input.setAttribute('placeholder', hint);
    return true;
  };

  if (setNickPlaceholder()) return;

  const host = document.querySelector('#twikoo-wrap') || document.body;
  const observer = new MutationObserver(function () {
    if (setNickPlaceholder()) observer.disconnect();
  });

  observer.observe(host, { childList: true, subtree: true });
});
