(function () {
  const cards = Array.from(document.querySelectorAll('[data-friend-link]'))
  if (!cards.length) return

  const cachePrefix = 'friend-link-meta:'
  const cacheMaxAge = 1000 * 60 * 60 * 24 * 7

  const getHost = (link) => {
    try {
      return new URL(link).hostname.replace(/^www\./i, '')
    } catch (err) {
      return ''
    }
  }

  const getFallbackName = (link) => {
    const host = getHost(link)
    if (!host) return 'Friend'
    return (host.split('.')[0] || host).replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
  }

  const getFallbackAvatar = (link) => {
    const host = getHost(link)
    return host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128` : ''
  }

  const readCache = (link) => {
    try {
      const cached = JSON.parse(localStorage.getItem(cachePrefix + link) || 'null')
      if (cached && Date.now() - cached.time < cacheMaxAge) return cached.data
    } catch (err) {}
    return null
  }

  const writeCache = (link, data) => {
    try {
      localStorage.setItem(cachePrefix + link, JSON.stringify({ time: Date.now(), data }))
    } catch (err) {}
  }

  const setText = (card, selector, value) => {
    if (!value) return
    card.querySelectorAll(selector).forEach(ele => {
      ele.textContent = value
      ele.setAttribute('title', value)
    })
  }

  const setAvatar = (card, value) => {
    if (!value) return
    card.querySelectorAll('.flink-item-icon img, .ft-friend-avatar').forEach(img => {
      img.src = value
    })
  }

  const applyMeta = (link, meta) => {
    cards.filter(card => card.dataset.friendLink === link).forEach(card => {
      if (card.dataset.autoName === 'true') setText(card, '.flink-item-name, .ft-friend-name', meta.name)
      if (card.dataset.autoDescr === 'true') setText(card, '.flink-item-desc, .ft-friend-desc', meta.descr)
      if (card.dataset.autoAvatar === 'true') setAvatar(card, meta.avatar)
    })
  }

  const fetchMeta = async (link) => {
    const cached = readCache(link)
    if (cached) return cached

    const fallback = {
      name: getFallbackName(link),
      descr: getHost(link) ? `来自 ${getHost(link)} 的朋友` : '一位正在路上的朋友',
      avatar: getFallbackAvatar(link)
    }

    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(link)}`)
      if (!response.ok) throw new Error('metadata request failed')
      const payload = await response.json()
      const data = payload && payload.data ? payload.data : {}
      const meta = {
        name: data.title || fallback.name,
        descr: data.description || fallback.descr,
        avatar: (data.logo && data.logo.url) || (data.image && data.image.url) || fallback.avatar
      }
      writeCache(link, meta)
      return meta
    } catch (err) {
      writeCache(link, fallback)
      return fallback
    }
  }

  const links = [...new Set(cards.map(card => card.dataset.friendLink).filter(Boolean))]
  links.forEach(link => {
    const needsAuto = cards.some(card => card.dataset.friendLink === link && (
      card.dataset.autoName === 'true' ||
      card.dataset.autoDescr === 'true' ||
      card.dataset.autoAvatar === 'true'
    ))

    if (needsAuto) fetchMeta(link).then(meta => applyMeta(link, meta))
  })
})()
