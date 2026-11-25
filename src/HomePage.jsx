import React, { useEffect, useRef, useState } from 'react'
import { awards, heroVideo, media, metrics, navigation, route, salaryGuide, sectors, social, solutions } from './content'
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
  const [slideIndex, setSlideIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const active = slideIndex % total

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
    setSlideIndex(index)
  }

  function step(delta) {
    setInstant(false)
    if (reducedMotion) {
      setSlideIndex((current) => (current + delta + total) % total)
      return
    }
    if (delta > 0) {
      setSlideIndex((current) => (current >= total ? 1 : current + 1))
    } else if (slideIndex === 0) {
      setSlideIndex(total - 1)
    } else {
      setSlideIndex((current) => current - 1)
    }
  }

  function handleTrackTransitionEnd(event) {
    if (event.target !== event.currentTarget) return
    if (slideIndex >= total) {
      setInstant(true)
      setSlideIndex(0)
    }
  }

  const slides = [...solutions, solutions[0], solutions[1]]

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
                      key={slideIndex}
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
          style={{ '--solution-index': slideIndex }}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {slides.map((item, index) => {
            const isDuplicate = index >= total
            const isActive = slideIndex === index
            return (
              <article
                key={isDuplicate ? `peek-${index}` : item.path}
                id={isDuplicate ? undefined : `solution-panel-${index}`}
                role={isDuplicate ? undefined : 'tabpanel'}
                aria-labelledby={isDuplicate ? undefined : `solution-tab-${index}`}
                aria-hidden={isDuplicate || !isActive}
                className={`solution-slide ${isActive ? 'is-active' : ''}`}
              >
                <img
                  src={item.image}
                  alt={isDuplicate ? '' : item.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
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
  return (
    <section className="wrap section story" aria-labelledby="story-title">
      <div>
        <h2 id="story-title">There’s a better way.</h2>
        <p>We build long-term partnerships with clients and candidates, combining personal relationships with investment in AI and technology to help businesses find talent.</p>
        <p>We help FTSE organisations and fast-growing scale-ups build high-performing teams. The Financial Times has recognised Forsyth Barnes as one of Europe’s fastest-growing businesses.</p>
        <Link className="text-link" path="/about-us">More about us <Arrow /></Link>
      </div>
      <ul className="sector-list" aria-label="Specialist sectors">
        {sectors.map(([name, url]) => <li key={url}><Link path={url}>{name}<Arrow /></Link></li>)}
      </ul>
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
  return (
    <section className="wrap section team" aria-labelledby="team-title">
      <div className="team-photo">
        {gallery.photos.slice(1).map(({ file, alt }) => <img key={file} src={media(file)} alt={alt} loading="lazy" />)}
      </div>
      <div>
        <h2 id="team-title">Join our team.</h2>
        <Link path="/join-our-team" className="text-link">Explore careers at Forsyth Barnes <Arrow /></Link>
        <details className="awards">
          <summary>Trust the experts <span aria-hidden="true">⌄</span></summary>
          <ul>{awards.map((award) => <li key={award}>{award}</li>)}</ul>
        </details>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-callout">
          <h2>Get in touch.</h2>
          <Link className="button primary" path="/contact-us">Contact us <Arrow /></Link>
        </div>
        <div className="footer-top">
          <Brand />
          <nav aria-label="Footer navigation">
            {navigation.map(([name, path]) => <Link key={path} path={path}>{name}</Link>)}
            <Link path="/join-our-team">Join our team</Link>
            <a href={salaryGuide}>Salary guides 2026</a>
          </nav>
          <nav aria-label="Social media">
            {social.map(([name, url]) => <a key={url} href={url}>{name}</a>)}
          </nav>
        </div>
        <a className="text-link news-link" href="https://www.thebusinessdesk.com/eastmidlands/news/2073781-magpies-appoint-new-ceo">In the news: Notts County FC CEO placement <Arrow /></a>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Forsyth Barnes</span>
          <Link path="/privacy-and-cookie-policies">Privacy policy</Link>
          <Link path="/terms-conditions">Terms &amp; conditions</Link>
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
        <Solutions />
        <About />
        <Results />
        <Videos />
        <Team />
      </main>
      <Footer />
    </div>
  )
}
