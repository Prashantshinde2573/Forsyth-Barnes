import React, { useEffect, useRef, useState } from 'react'
import { accolades, awards, heroVideo, media, metrics, navigation, route, salaryGuide, social, solutions } from './content'
import gallery from './media.json'
import { officePins, worldRegions } from './worldMap'

function Link({ path, children, ...props }) {
  return <a href={route(path)} {...props}>{children}</a>
}

function Arrow({ children = '↗' }) {
  return <span aria-hidden="true" className="arrow">{children}</span>
}

function Brand({ transparent = false }) {
  return <a href="#top" className="brand"><img src={media(transparent ? 'logo-white.png' : 'logo.svg')} alt="Forsyth Barnes home" width="157" height="42" /></a>
}

function Header() {
  const header = useRef(null)
  const mobileToggle = useRef(null)
  const closeTimer = useRef(null)
  const [active, setActive] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  function clearHoverTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function closeMenus() {
    clearHoverTimer()
    setActive(null)
    setMobileOpen(false)
  }

  function handleHoverEnter(index) {
    if (window.matchMedia('(max-width: 960px)').matches) return
    clearHoverTimer()
    setActive(index)
  }

  function handleHoverLeave() {
    if (window.matchMedia('(max-width: 960px)').matches) return
    clearHoverTimer()
    closeTimer.current = setTimeout(() => setActive(null), 120)
  }

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 960px)')
    const updateScroll = () => setScrolled(window.scrollY > 8)
    const outside = (event) => {
      if (!header.current.contains(event.target)) closeMenus()
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pageshow', updateScroll)
    document.addEventListener('pointerdown', outside)
    breakpoint.addEventListener('change', closeMenus)
    return () => {
      clearHoverTimer()
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('pageshow', updateScroll)
      document.removeEventListener('pointerdown', outside)
      breakpoint.removeEventListener('change', closeMenus)
    }
  }, [])

  function dismiss(event) {
    if (event.key !== 'Escape') return
    if (active !== null) {
      event.preventDefault()
      header.current.querySelector('#nav-trigger-' + active).focus()
      setActive(null)
    } else if (mobileOpen) {
      event.preventDefault()
      mobileToggle.current.focus()
      setMobileOpen(false)
    }
  }

  const solid = scrolled || mobileOpen

  return (
    <header
      ref={header}
      className={`header ${solid ? 'is-scrolled' : 'is-transparent'}`}
      onKeyDown={dismiss}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenus()
      }}
    >
      <div className="wrap header-inner">
        <Brand transparent={!solid} />
        <button
          type="button"
          ref={mobileToggle}
          className="mobile-toggle"
          aria-controls="primary-nav"
          aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen(!mobileOpen)
            setActive(null)
          }}
        >
          {mobileOpen ? 'Close' : 'Menu'} <span aria-hidden="true">{mobileOpen ? '×' : '☰'}</span>
        </button>
        <nav id="primary-nav" className="primary-nav" aria-label="Primary navigation" data-mobile-open={mobileOpen}>
          {navigation.map(([label, path, links], index) => {
            const open = active === index
            const panel = 'nav-panel-' + index
            const trigger = 'nav-trigger-' + index
            return (
              <div
                className="nav-group"
                key={path}
                data-open={open}
                onMouseEnter={() => handleHoverEnter(index)}
                onMouseLeave={handleHoverLeave}
              >
                <button
                  type="button"
                  className="nav-trigger"
                  id={trigger}
                  aria-expanded={open}
                  aria-controls={panel}
                  onClick={() => setActive(open ? null : index)}
                >
                  {label}<span aria-hidden="true" className="nav-chevron" />
                </button>
                <div className="nav-panel" id={panel} inert={!open} aria-labelledby={trigger}>
                  <ul className="nav-grid">
                    {[[label === 'Job search' ? 'All jobs' : label, path], ...links].map(([name, url]) => (
                      <li key={url}>
                        <Link path={url} className="nav-card" onClick={closeMenus}>
                          <span>{name}</span>
                          <Arrow />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
          <div className="nav-actions">
            <Link path="/login" onClick={closeMenus}>Sign in</Link>
            <Link className="button primary" path="/contact-us" onClick={closeMenus}>Contact <Arrow /></Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  const video = useRef(null)
  const [motionAllowed, setMotionAllowed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setMotionAllowed(!preference.matches)
      if (preference.matches) {
        setPlaying(false)
        setStarted(false)
      }
    }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  function togglePlayback() {
    const player = video.current
    if (player.paused) {
      player.play().catch(() => {})
    } else {
      player.pause()
    }
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <picture className="hero-photo">
        <source media="(max-width: 600px)" srcSet={media('team-70-mobile.jpg')} />
        <img src={media(gallery.photos[0].file)} alt="" fetchPriority="high" />
      </picture>
      {motionAllowed && !failed && (
        <video
          ref={video}
          className="hero-video"
          src={heroVideo}
          aria-hidden="true"
          tabIndex={-1}
          autoPlay
          muted
          loop
          playsInline
          data-started={started}
          onPlaying={() => { setStarted(true); setPlaying(true) }}
          onPause={() => setPlaying(false)}
          onError={() => { setPlaying(false); setFailed(true) }}
        />
      )}
      <div className="wrap hero-inner">
        <h1 id="hero-title">The right people to<br className="hero-break" /> <span className="hero-title-muted">find the right people.</span></h1>
        <p>A global talent partner for mid-level to executive recruitment across eTail, FinTech, and Sports &amp; Entertainment.</p>
        <div className="actions">
          <Link path="/join-our-team" className="button primary">Join Our Team <Arrow /></Link>
          <a href={salaryGuide} className="button outline">Salary Guide <Arrow /></a>
        </div>
      </div>
      {motionAllowed && !failed && (
        <button type="button" className="hero-playback" onClick={togglePlayback} aria-label={playing ? 'Pause background video' : 'Play background video'}>
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
        </button>
      )}
    </section>
  )
}

function Rail({ id, heading, children, className = '' }) {
  const track = useRef(null)

  function move(direction) {
    const element = track.current
    const max = element.scrollWidth - element.clientWidth
    const atEnd = element.scrollLeft >= max - 2
    const atStart = element.scrollLeft <= 2
    const distance = element.clientWidth * 0.85
    let left = element.scrollLeft + direction * distance
    if (direction > 0 && atEnd) left = 0
    if (direction < 0 && atStart) left = max
    element.scrollTo({ left })
  }

  return (
    <section className={`rail-section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <div className="rail-header">
          <h2 id={`${id}-title`}>{heading}</h2>
          <div className="rail-controls">
            <button type="button" aria-label={`Previous ${id}`} aria-controls={id} onClick={() => move(-1)}><Arrow>←</Arrow></button>
            <button type="button" aria-label={`Next ${id}`} aria-controls={id} onClick={() => move(1)}><Arrow>→</Arrow></button>
          </div>
        </div>
        <ul className="rail" id={id} ref={track} tabIndex={0} aria-labelledby={`${id}-title`}>{children}</ul>
      </div>
    </section>
  )
}

function Clients() {
  const logos = gallery.clients.map(({ file, alt }) => ({
    file,
    name: alt.replace(/ logo$/i, '') || 'Client logo',
  }))

  return (
    <section className="rail-section clients" aria-labelledby="clients-title">
      <div className="wrap">
        <div className="rail-header">
          <h2 id="clients-title">Our clients</h2>
        </div>
        <div className="clients-marquee">
          <ul className="clients-track">
            {logos.map(({ file, name }) => (
              <li key={file}>
                <img src={media(file)} alt={name} decoding="async" />
              </li>
            ))}
            {logos.map(({ file, name }) => (
              <li key={`dup-${file}`} aria-hidden="true">
                <img src={media(file)} alt="" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Solutions() {
  const total = solutions.length
  const offset = 2
  const [trackIndex, setTrackIndex] = useState(offset)
  const [instant, setInstant] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const active = ((trackIndex - offset) % total + total) % total

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(pref.matches)
    sync()
    pref.addEventListener('change', sync)
    return () => pref.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!instant) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setInstant(false))
    })
    return () => cancelAnimationFrame(id)
  }, [instant])

  function selectTab(index) {
    setInstant(false)
    setTrackIndex(offset + index)
  }

  function step(delta) {
    setInstant(false)
    if (reducedMotion) {
      setTrackIndex(offset + ((active + delta + total) % total))
      return
    }
    setTrackIndex((current) => Math.max(1, Math.min(offset + total, current + delta)))
  }

  function handleTrackTransitionEnd(event) {
    if (event.target !== event.currentTarget) return
    if (trackIndex >= offset + total) {
      setInstant(true)
      setTrackIndex(offset)
    } else if (trackIndex < offset) {
      setInstant(true)
      setTrackIndex(offset + total - 1)
    }
  }

  const slides = [
    solutions[total - 2],
    solutions[total - 1],
    ...solutions,
    solutions[0],
    solutions[1],
  ]

  return (
    <section
      className="solutions"
      aria-labelledby="solutions-title"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="wrap">
        <div className="solutions-header">
          <h2 id="solutions-title">Our solutions</h2>
          <div
            className="solutions-tabs"
            role="tablist"
            aria-label="Recruitment solutions"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {solutions.map((item, index) => {
              const selected = active === index
              return (
                <button
                  key={item.path}
                  type="button"
                  role="tab"
                  id={`solution-tab-${index}`}
                  aria-selected={selected}
                  aria-controls={`solution-panel-${index}`}
                  className={`solution-tab ${selected ? 'is-active' : ''}`}
                  onClick={() => selectTab(index)}
                >
                  {selected && !reducedMotion && (
                    <span
                      key={active}
                      className="solution-tab-fill"
                      data-paused={paused}
                      onAnimationEnd={() => step(1)}
                    />
                  )}
                  <span className="solution-tab-label">{item.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="solutions-viewport">
        <div
          className={`solutions-track ${instant ? 'is-instant' : ''}`}
          style={{ '--track-index': trackIndex }}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {slides.map((item, index) => {
            const isClone = index < offset || index >= offset + total
            const isActive = trackIndex === index
            const realIndex = index - offset
            return (
              <article
                key={isClone ? `clone-${index}` : item.path}
                id={isClone ? undefined : `solution-panel-${realIndex}`}
                role={isClone ? undefined : 'tabpanel'}
                aria-labelledby={isClone ? undefined : `solution-tab-${realIndex}`}
                aria-hidden={isClone || !isActive}
                className={`solution-slide ${isActive ? 'is-active' : ''}`}
              >
                <img
                  src={item.image}
                  alt={isClone ? '' : item.alt}
                  loading={index === offset ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <div
                  className="solution-card"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link path={item.path} className="solution-link" tabIndex={isActive ? 0 : -1}>
                    Learn More <Arrow>→</Arrow>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        <button
          type="button"
          className="solution-arrow prev"
          aria-label="Previous solution"
          onClick={() => step(-1)}
        >
          <Arrow>←</Arrow>
        </button>
        <button
          type="button"
          className="solution-arrow next"
          aria-label="Next solution"
          onClick={() => step(1)}
        >
          <Arrow>→</Arrow>
        </button>
      </div>
    </section>
  )
}

function About() {
  const track = useRef(null)

  function move(direction) {
    const element = track.current
    if (!element) return
    const max = element.scrollWidth - element.clientWidth
    const distance = Math.max(220, element.clientWidth * 0.55)
    let left = element.scrollLeft + direction * distance
    if (direction > 0 && element.scrollLeft >= max - 4) left = 0
    if (direction < 0 && element.scrollLeft <= 4) left = max
    element.scrollTo({ left, behavior: 'smooth' })
  }

  return (
    <section className="section story" aria-labelledby="story-title">
      <div className="wrap story-header">
        <h2 id="story-title">There’s a better way.</h2>
        <p>Forsyth Barnes is a global talent partner disrupting the recruitment industry — blending personal partnerships with AI and technology for FTSE organisations and hyper-growth scale-ups.</p>
        <Link className="text-link" path="/about-us">More about us <Arrow /></Link>
      </div>

      <div className="wrap story-accolades">
        <ul className="accolades-track" ref={track} aria-label="Awards and accolades">
          {accolades.map(({ file, title, bg }) => (
            <li key={file} className="accolade-item">
              <div className="accolade-tile" style={{ backgroundColor: bg }}>
                <img src={media(file)} alt={title} loading="lazy" decoding="async" />
              </div>
              <span className="accolade-title">{title}</span>
            </li>
          ))}
        </ul>

        <div className="accolades-controls">
          <button type="button" aria-label="Previous accolades" onClick={() => move(-1)}>‹</button>
          <button type="button" aria-label="Next accolades" onClick={() => move(1)}>›</button>
        </div>
      </div>
    </section>
  )
}

function LookingFor() {
  const cardRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    const bg = bgRef.current
    if (!card || !bg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = null

    function update() {
      rafId = null
      const rect = card.getBoundingClientRect()
      const vh = window.innerHeight || 800
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
      const offset = (progress - 0.5) * 56
      bg.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.08)`
    }

    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className="wrap looking-for" aria-label="How can we help you">
      <div className="looking-for-grid">
        <article className="intent-card is-employer">
          <span className="intent-badge">For Employers</span>
          <h3>I’m looking to fill mid to executive positions</h3>
          <p>Are you looking for a talent partner? We can help.</p>
          <ul className="intent-proof" aria-label="Employer track record">
            <li>98% searches filled</li>
            <li>99% on-time shortlists</li>
            <li>eTail, FinTech &amp; Sports</li>
          </ul>
          <div className="intent-actions">
            <Link path="/solutions" className="button intent-cta">
              Explore Solutions <Arrow />
            </Link>
            <Link path="/contact-us" className="intent-secondary">
              Book a Consultation <Arrow />
            </Link>
          </div>
        </article>

        <article ref={cardRef} className="intent-card is-candidate">
          <img
            ref={bgRef}
            src={media('team-68.jpg')}
            alt=""
            aria-hidden="true"
            className="intent-bg"
            loading="lazy"
            decoding="async"
          />
          <span className="intent-badge">For Candidates</span>
          <h3>I’m looking for career enhancement</h3>
          <p>Are you looking for career progression? We can find it for you.</p>
          <ul className="intent-proof" aria-label="Candidate opportunities">
            <li>Mid-level to C-suite</li>
            <li>FTSE &amp; global scale-ups</li>
            <li>97% 2+ yr retention</li>
          </ul>
          <div className="intent-actions">
            <Link path="/jobs" className="button primary intent-cta">
              Browse Open Roles <Arrow />
            </Link>
            <a href={salaryGuide} className="intent-secondary">
              2026 Salary Guide <Arrow />
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}

function Results() {
  const sectionRef = useRef(null)
  const pieceRefs = useRef([])
  const pinsRef = useRef(null)
  const [activeOffice, setActiveOffice] = useState(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let target = 0
    let current = 0
    let rafId = null

    function applyProgress(progress) {
      const scale = window.innerWidth <= 768 ? 0.62 : 1
      for (let i = 0; i < worldRegions.length; i++) {
        const el = pieceRefs.current[i]
        if (!el) continue
        const region = worldRegions[i]
        const span = 1 - region.delay
        const local = span > 0 ? Math.min(1, Math.max(0, (progress - region.delay) / span)) : 1
        const eased = 1 - Math.pow(1 - local, 2)
        const tx = region.x * scale * (1 - eased)
        const ty = region.y * scale * (1 - eased)
        const rot = region.r * (1 - eased)
        const op = 0.06 + 0.94 * eased
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`
        el.style.opacity = op.toFixed(3)
      }
      if (pinsRef.current) {
        const pinP = Math.min(1, Math.max(0, (progress - 0.68) / 0.32))
        pinsRef.current.style.opacity = pinP.toFixed(3)
      }
    }

    if (reduced.matches) {
      applyProgress(1)
      return
    }

    function tick() {
      rafId = null
      const diff = target - current
      if (Math.abs(diff) < 0.001) {
        current = target
        applyProgress(current)
        return
      }
      current += diff * 0.075
      applyProgress(current)
      rafId = requestAnimationFrame(tick)
    }

    function updateTarget() {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || 800
      const start = vh * 0.56
      const end = vh * 0.02
      target = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    const rect = section.getBoundingClientRect()
    const vh = window.innerHeight || 800
    target = Math.min(1, Math.max(0, (vh * 0.56 - rect.top) / (vh * 0.54)))
    current = target
    applyProgress(current)

    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget)
    return () => {
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const officeOrder = ['London', 'New York', 'Nottingham', 'Dubai']

  return (
    <section ref={sectionRef} className="results section" aria-labelledby="results-title">
      <div className="wrap results-layout">
        <div className="results-map-col">
          <div className="world-map-frame">
            <svg
              viewBox="0 0 1000 500"
              className="world-map-svg"
              role="img"
              aria-label="World map showing Forsyth Barnes offices in London, Nottingham, New York, and Dubai"
            >
              <g className="world-grid" aria-hidden="true">
                {[125, 250, 375].map((y) => <line key={`h-${y}`} x1="0" y1={y} x2="1000" y2={y} />)}
                {[200, 400, 600, 800].map((x) => <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="500" />)}
              </g>
              <g className="world-regions">
                {worldRegions.map((region, index) => (
                  <path
                    key={region.id}
                    ref={(el) => { pieceRefs.current[index] = el }}
                    data-region-id={region.id}
                    className={`world-piece ${region.hub ? 'is-hub' : ''}`}
                    d={region.d}
                  />
                ))}
              </g>
              <g ref={pinsRef} className="world-pins-layer">
                <path className="world-arc" d="M274.3,149.6 Q380,68 486,112" />
                <path className="world-arc" d="M486,112 Q575,132 643.6,205.8" />
                {officePins.map((pin) => {
                  const highlighted = activeOffice === pin.name
                  const boxWidth = pin.name.length * 7.8 + 22
                  const boxX = pin.align === 'end' ? pin.lx - boxWidth : pin.lx
                  return (
                    <g
                      key={pin.name}
                      className={`world-pin ${highlighted ? 'is-active' : ''}`}
                      onMouseEnter={() => setActiveOffice(pin.name)}
                      onMouseLeave={() => setActiveOffice(null)}
                    >
                      <line className="world-pin-line" x1={pin.x} y1={pin.y} x2={pin.lx} y2={pin.ly} />
                      <circle className="world-pin-pulse" cx={pin.x} cy={pin.y} r="10" />
                      <circle className="world-pin-dot" cx={pin.x} cy={pin.y} r="4.5" />
                      <g className="world-pin-label">
                        <rect x={boxX} y={pin.ly - 13} width={boxWidth} height="24" rx="4" />
                        <text
                          x={pin.align === 'end' ? pin.lx - 11 : pin.lx + 11}
                          y={pin.ly + 3}
                          textAnchor={pin.align}
                        >
                          {pin.name}
                        </text>
                      </g>
                    </g>
                  )
                })}
              </g>
            </svg>
          </div>
        </div>

        <div className="results-info-col">
          <h2 id="results-title">Four offices.<br />Global assignments.</h2>
          <dl className="metrics">
            {metrics.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
          </dl>
          <div className="offices">
            {officeOrder.map((city) => (
              <Link
                key={city}
                path="/contact-us"
                className={activeOffice === city ? 'is-active' : ''}
                onMouseEnter={() => setActiveOffice(city)}
                onMouseLeave={() => setActiveOffice(null)}
                onFocus={() => setActiveOffice(city)}
                onBlur={() => setActiveOffice(null)}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Videos() {
  const dialog = useRef(null)
  const [video, setVideo] = useState(null)

  function open(item) {
    setVideo(item)
    dialog.current.showModal()
  }

  return (
    <>
      <Rail id="videos" heading="Watch our videos" className="section videos">
        {gallery.videos.map((item) => (
          <li key={item.url}>
            <button type="button" className="video-card" onClick={() => open(item)}>
              <span className="video-image"><img src={media(item.file)} alt="" loading="lazy" width="480" height="270" /><span className="play" aria-hidden="true">▶</span></span>
              <span className="video-title">{item.title}<Arrow /></span>
            </button>
          </li>
        ))}
      </Rail>
      <dialog ref={dialog} aria-label={video?.title || 'Video player'} onClose={() => setVideo(null)}>
        <div className="dialog-heading">
          <h2>{video?.title}</h2>
          <form method="dialog"><button type="submit" autoFocus aria-label="Close video">×</button></form>
        </div>
        {video && <><video controls playsInline preload="metadata" src={video.url} poster={media(video.file)} /><a href={video.url} className="text-link">Open video directly <Arrow /></a></>}
      </dialog>
    </>
  )
}

function Team() {
  const topLeft = gallery.photos[3]
  const bottomLeft = gallery.photos[1]

  return (
    <section className="wrap section team" aria-labelledby="team-title">
      <div className="team-collage">
        <div className="team-col-left">
          <figure className="team-card">
            <img src={media(topLeft.file)} alt={topLeft.alt} loading="lazy" />
          </figure>
          <figure className="team-card">
            <img src={media(bottomLeft.file)} alt={bottomLeft.alt} loading="lazy" />
          </figure>
        </div>
        <div className="team-col-right">
          <figure className="team-card is-tall">
            <img src={media('team-portrait.jpg')} alt="Forsyth Barnes team incentive trip." loading="lazy" />
          </figure>
        </div>
        <div className="team-emblem" aria-hidden="true">
          <svg className="team-emblem-ring" viewBox="0 0 120 120">
            <defs>
              <path id="fb-team-ring" d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text>
              <textPath href="#fb-team-ring" startOffset="2%">
                FORSYTH BARNES • JOIN OUR TEAM •
              </textPath>
            </text>
          </svg>
          <svg className="team-emblem-b" width="24" height="33" viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.53 49.54H0V43.994H18.8C24.789 43.994 28.356 40.911 28.356 35.741C28.356 30.508 24.497 27.125 18.525 27.125H18.125V21.747C23.577 21.547 27.063 18.47 27.063 13.817C27.063 9 23.534 6 17.872 6H0V0.43H18.592C28.123 0.43 34.281 5.285 34.281 12.794C34.281 17.979 31.392 21.868 26.132 23.749L24.055 24.505L26.23 24.886C31.392 25.786 35.438 30.936 35.438 36.61C35.438 44.34 29.045 49.54 19.53 49.54Z" fill="#8c4b9d" />
          </svg>
        </div>
      </div>
      <div className="team-copy">
        <h2 id="team-title">Join our team.</h2>
        <p>Build your career with a fast-growing global talent partner across London, New York, Nottingham, and Dubai.</p>
        <Link path="/join-our-team" className="button primary team-cta">Explore careers at Forsyth Barnes <Arrow /></Link>
        <details className="awards">
          <summary>Trust the experts <span aria-hidden="true">⌄</span></summary>
          <ul>{awards.map((award) => <li key={award}>{award}</li>)}</ul>
        </details>
      </div>
    </section>
  )
}

function SocialIcon({ name }) {
  switch (name) {
    case 'LinkedIn':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5A2.02 2.02 0 0 0 3.22 5.52 2.02 2.02 0 0 0 5.25 7.55 2.02 2.02 0 0 0 7.28 5.52 2.02 2.02 0 0 0 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.21 16.17 8.21C14.37 8.21 13.48 9.21 13.02 9.94V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
        </svg>
      )
    case 'Instagram':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'YouTube':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.58 7.19C21.35 6.33 20.67 5.65 19.81 5.42C18.25 5 12 5 12 5C12 5 5.75 5 4.19 5.42C3.33 5.65 2.65 6.33 2.42 7.19C2 8.75 2 12 2 12C2 12 2 15.25 2.42 16.81C2.65 17.67 3.33 18.35 4.19 18.58C5.75 19 12 19 12 19C12 19 18.25 19 19.81 18.58C20.67 18.35 21.35 17.67 21.58 16.81C22 15.25 22 12 22 12C22 12 22 8.75 21.58 7.19ZM10 15V9L15.2 12L10 15Z" />
        </svg>
      )
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      )
  }
}

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(event) {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  const orbitAvatars = [
    { file: 'team-68.jpg', pos: 'pos-1' },
    { file: 'team-69.jpg', pos: 'pos-2' },
    { file: 'team-65.jpg', pos: 'pos-3' },
    { file: 'team-67.jpg', pos: 'pos-4' },
    { file: 'team-70.jpg', pos: 'pos-5' },
  ]

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-callout">
          <div className="footer-callout-copy">
            <span className="footer-eyebrow">Global Talent Partner</span>
            <h2>Get in touch.</h2>
            <p>Partner with our specialists to fill mid-to-executive roles or unlock your next career move.</p>
            <Link className="button footer-pill-btn" path="/contact-us">
              Contact us <Arrow />
            </Link>
          </div>
          <div className="footer-orbit" aria-hidden="true">
            <span className="orbit-ring ring-3" />
            <span className="orbit-ring ring-2" />
            <span className="orbit-ring ring-1" />
            <div className="orbit-center">
              <svg width="22" height="22" viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.53 49.54H0V43.994H18.8C24.789 43.994 28.356 40.911 28.356 35.741C28.356 30.508 24.497 27.125 18.525 27.125H18.125V21.747C23.577 21.547 27.063 18.47 27.063 13.817C27.063 9 23.534 6 17.872 6H0V0.43H18.592C28.123 0.43 34.281 5.285 34.281 12.794C34.281 17.979 31.392 21.868 26.132 23.749L24.055 24.505L26.23 24.886C31.392 25.786 35.438 30.936 35.438 36.61C35.438 44.34 29.045 49.54 19.53 49.54Z" fill="#8c4b9d" />
              </svg>
            </div>
            {orbitAvatars.map(({ file, pos }) => (
              <img key={file} src={media(file)} alt="" className={`orbit-avatar ${pos}`} loading="lazy" decoding="async" />
            ))}
          </div>
        </div>

        <div className="footer-top">
          <div className="footer-brand-col">
            <Brand />
            <p>A global talent partner for mid-level to executive recruitment across eTail, FinTech, and Sports &amp; Entertainment.</p>
            <nav className="footer-socials" aria-label="Social media">
              {social.map(([name, url]) => (
                <a key={url} href={url} aria-label={name} title={name} target="_blank" rel="noreferrer">
                  <SocialIcon name={name} />
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-links-grid">
            {navigation.map(([group, path, links]) => (
              <div className="footer-col" key={path}>
                <h3>{group}</h3>
                <nav aria-label={`${group} links`}>
                  <Link path={path}>
                    {group === 'Job search' ? 'All jobs' : group === 'About us' ? 'About us' : `All ${group.toLowerCase()}`}
                  </Link>
                  {links.map(([name, url]) => <Link key={url} path={url}>{name}</Link>)}
                  {group === 'Job search' && <a href={salaryGuide}>Salary guides 2026 <Arrow /></a>}
                </nav>
              </div>
            ))}
          </div>

          <div className="footer-col footer-newsletter">
            <h3>Newsletter</h3>
            <p>Get talent market insights, salary guides, and executive opportunities.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <span className="newsletter-at" aria-hidden="true">@</span>
              <input
                type="email"
                required
                aria-label="Email address"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (subscribed) setSubscribed(false)
                }}
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                <Arrow>→</Arrow>
              </button>
            </form>
            {subscribed && (
              <p className="newsletter-note" role="status">
                Thanks! We’ll keep you updated.
              </p>
            )}
            <a className="news-link" href="https://www.thebusinessdesk.com/eastmidlands/news/2073781-magpies-appoint-new-ceo">
              In the news: Notts County FC CEO placement <Arrow />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© {new Date().getFullYear()} Forsyth Barnes</span>
            <Link path="/privacy-and-cookie-policies">Privacy policy</Link>
            <Link path="/terms-conditions">Terms &amp; conditions</Link>
          </div>
          <div className="footer-cities">
            London · New York · Nottingham · Dubai
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="fb-home" id="top">
      <a className="skip" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Clients />
        <About />
        <Results />
        <Solutions />
        <LookingFor />
        <Videos />
        <Team />
      </main>
      <Footer />
    </div>
  )
}
