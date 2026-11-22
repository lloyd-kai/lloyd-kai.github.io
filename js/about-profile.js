(function () {
  function initAboutRecommendCards () {
    var cards = document.querySelectorAll('.about-recommend-card')
    if (!cards.length) return

    cards.forEach(function (card) {
      if (card.dataset.aboutHoverReady === 'true') return

      card.addEventListener('mouseenter', function () {
        card.classList.add('is-focus')
      })

      card.addEventListener('mouseleave', function () {
        card.classList.remove('is-focus')
      })

      card.dataset.aboutHoverReady = 'true'
    })
  }

  document.addEventListener('DOMContentLoaded', initAboutRecommendCards)
  document.addEventListener('pjax:complete', initAboutRecommendCards)
  document.addEventListener('pjax:success', initAboutRecommendCards)
})()
