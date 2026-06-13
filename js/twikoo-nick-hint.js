(function () {
  const hints = {
    nick: '输入QQ号会自动获取昵称和头像',
    mail: '收到回复将会发送到您的邮箱',
    link: '可以通过昵称访问您的网站'
  }

  const selectors = {
    nick: '#twikoo input[name="nick"], #twikoo .tk-meta-input:nth-child(1) input',
    mail: '#twikoo input[name="mail"], #twikoo .tk-meta-input:nth-child(2) input',
    link: '#twikoo input[name="link"], #twikoo .tk-meta-input:nth-child(3) input'
  }

  let hintElement
  let activeInput
  let observer
  let observerHost

  const injectStyle = function () {
    if (document.getElementById('twikoo-input-hint-style')) return

    const style = document.createElement('style')
    style.id = 'twikoo-input-hint-style'
    style.textContent = `
      .tk-input-hint {
        position: absolute;
        z-index: 1000;
        max-width: min(280px, calc(100vw - 32px));
        padding: 8px 12px;
        border-radius: 8px;
        background: var(--btn-bg, #49b1f5);
        color: #fff;
        font-size: 13px;
        line-height: 1.45;
        box-shadow: 0 8px 18px rgba(0, 0, 0, .16);
        opacity: 0;
        pointer-events: none;
        transform: translateY(calc(-100% - 4px));
        transition: opacity .2s ease, transform .2s ease;
      }

      .tk-input-hint::after {
        content: '';
        position: absolute;
        left: 18px;
        bottom: -6px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--btn-bg, #49b1f5);
      }

      .tk-input-hint.is-visible {
        opacity: 1;
        transform: translateY(calc(-100% - 8px));
      }
    `

    document.head.appendChild(style)
  }

  const ensureHintElement = function () {
    if (hintElement) return hintElement

    hintElement = document.createElement('div')
    hintElement.className = 'tk-input-hint'
    document.body.appendChild(hintElement)
    return hintElement
  }

  const positionHint = function (input) {
    const hint = ensureHintElement()
    const rect = input.getBoundingClientRect()
    const scrollX = window.scrollX || window.pageXOffset || 0
    const scrollY = window.scrollY || window.pageYOffset || 0

    hint.style.left = Math.max(16, rect.left + scrollX) + 'px'
    hint.style.top = Math.max(16, rect.top + scrollY) + 'px'
  }

  const showHint = function (input, text) {
    activeInput = input
    const hint = ensureHintElement()

    hint.textContent = text
    positionHint(input)
    hint.classList.add('is-visible')
  }

  const hideHint = function () {
    activeInput = null
    if (hintElement) hintElement.classList.remove('is-visible')
  }

  const bindInput = function (key) {
    const input = document.querySelector(selectors[key])
    if (!input || input.getAttribute('data-twikoo-hint-bound') === 'true') return false

    input.setAttribute('data-twikoo-hint-bound', 'true')
    input.addEventListener('focus', function () {
      showHint(input, hints[key])
    })
    input.addEventListener('click', function () {
      showHint(input, hints[key])
    })
    input.addEventListener('blur', hideHint)

    return true
  }

  const bindInputs = function () {
    injectStyle()
    return ['nick', 'mail', 'link'].map(bindInput).some(Boolean)
  }

  const refreshHintPosition = function () {
    if (activeInput) positionHint(activeInput)
  }

  const init = function () {
    bindInputs()

    const host = document.querySelector('#twikoo-wrap') || document.body
    if (observer && observerHost === host) return
    if (observer) observer.disconnect()

    observerHost = host
    observer = new MutationObserver(bindInputs)
    observer.observe(host, { childList: true, subtree: true })
  }

  document.addEventListener('DOMContentLoaded', init)
  document.addEventListener('pjax:complete', init)
  document.addEventListener('pjax:success', init)

  if (window.addEventListener) {
    window.addEventListener('scroll', refreshHintPosition, true)
    window.addEventListener('resize', refreshHintPosition)
  }
})()
