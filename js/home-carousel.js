(function () {
  function initHomeCarousel () {
    var carousel = document.getElementById('home-cover-carousel')
    if (!carousel || carousel.dataset.initialized === 'true') return

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.home-cover-slide'))
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.home-cover-dot'))
    var prev = carousel.querySelector('.home-cover-prev')
    var next = carousel.querySelector('.home-cover-next')
    var interval = Number(carousel.dataset.interval) || 5000
    var current = 0
    var timer

    if (slides.length <= 1) {
      carousel.dataset.initialized = 'true'
      return
    }

    function show (index) {
      current = (index + slides.length) % slides.length
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current)
      })
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current)
      })
    }

    function start () {
      stop()
      timer = setInterval(function () {
        show(current + 1)
      }, interval)
    }

    function stop () {
      if (timer) clearInterval(timer)
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1)
        start()
      })
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1)
        start()
      })
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index)
        start()
      })
    })

    carousel.addEventListener('mouseenter', stop)
    carousel.addEventListener('mouseleave', start)
    carousel.dataset.initialized = 'true'
    start()
  }

  document.addEventListener('DOMContentLoaded', initHomeCarousel)
  document.addEventListener('pjax:complete', initHomeCarousel)
  document.addEventListener('pjax:success', initHomeCarousel)
})()
