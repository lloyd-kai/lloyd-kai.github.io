document.addEventListener('DOMContentLoaded', function () {
  const hints = {
    nick: '输入QQ号会自动获取昵称和头像',
    mail: '收到回复将会发送到您的邮箱',
    link: '可以通过昵称访问您的网站'
  };

  const selectors = {
    nick: '#twikoo input[name="nick"], #twikoo .tk-meta-input:nth-child(1) input',
    mail: '#twikoo input[name="mail"], #twikoo .tk-meta-input:nth-child(2) input',
    link: '#twikoo input[name="link"], #twikoo .tk-meta-input:nth-child(3) input'
  };

  const setMetaPlaceholders = function () {
    let count = 0;

    ['nick', 'mail', 'link'].forEach(function (key) {
      const input = document.querySelector(selectors[key]);
      if (!input) return;
      input.setAttribute('placeholder', hints[key]);
      count += 1;
    });

    return count === 3;
  };

  if (setMetaPlaceholders()) return;

  const host = document.querySelector('#twikoo-wrap') || document.body;
  const observer = new MutationObserver(function () {
    if (setMetaPlaceholders()) observer.disconnect();
  });

  observer.observe(host, { childList: true, subtree: true });
});
