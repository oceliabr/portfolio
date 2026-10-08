/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;
const D = window.PORTFOLIO_DATA;

/* ===== Utilities ===== */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrolled() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const onScroll = () => setS(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return s;
}

/* ===== Accessible dialog: focus move-in, focus-trap, restore, Escape, scroll-lock ===== */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function useDialog(isOpen, onClose) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const prevFocus = document.activeElement;

    // Move focus into the dialog on open
    const focusables = () => Array.from(dialog.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    const first = focusables()[0];
    (first || dialog).focus();

    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onCloseRef.current(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) { e.preventDefault(); dialog.focus(); return; }
      const top = f[0];
      const bottom = f[f.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === top || active === dialog)) {
        e.preventDefault(); bottom.focus();
      } else if (!e.shiftKey && active === bottom) {
        e.preventDefault(); top.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Restore focus to the element that opened the dialog
      if (prevFocus && typeof prevFocus.focus === "function") prevFocus.focus();
    };
  }, [isOpen]);
  return dialogRef;
}

/* ===== Cursor ===== */
function CustomCursor() {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    const over = (e) => {
      const t = e.target;
      const isInteractive = t.closest("a, button, .project, .service, .testimonial, [data-cursor]");
      setHover(!!isInteractive);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);
  return <div ref={ref} className={"cursor" + (hover ? " hover" : "")} aria-hidden="true"></div>;
}

/* ===== Nav ===== */
function Nav() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {document.body.style.overflow = "";};
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") setOpen(false);};
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const links = [
  ["#projects", "01", "Projets"],
  ["#about", "02", "Approche"],
  ["#parcours", "03", "Parcours"],
  ["#contact", "04", "Contact"]];


  return (
    <>
      <nav className={"nav" + (scrolled ? " scrolled" : "") + (open ? " open" : "")}>
        <div className="container nav-inner">
          <a href="#top" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-dot"></span>
            <span>Océlia</span>
          </a>
          <div className="nav-links">
            {links.map(([href, num, label]) =>
            <a key={href} href={href}><span className="num">{num}</span>{label}</a>
            )}
          </div>
          <button
            className={"nav-burger" + (open ? " active" : "")}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={"nav-drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="nav-drawer-inner">
          <ul className="nav-drawer-list">
            {links.map(([href, num, label], i) =>
            <li key={href} style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}>
                <a href={href} onClick={() => setOpen(false)}>
                  <span className="num">{num}</span>
                  <span className="lbl">{label}</span>
                  <span className="arr">→</span>
                </a>
              </li>
            )}
          </ul>
          <div className="nav-drawer-foot">
            <a href="mailto:oceliabrf@gmail.com" onClick={() => setOpen(false)}>oceliabrf@gmail.com</a>
            <div className="nav-drawer-social">
              <a href="https://www.linkedin.com/in/oceliab/" onClick={() => setOpen(false)}>LinkedIn</a>
              <a href="https://www.behance.net/ocelia?locale=fr_FR" onClick={() => setOpen(false)}>Behance</a>
            </div>
          </div>
        </div>
      </div>
    </>);

}

/* ===== Hero ===== */
function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container">
        <h1 className="display hero-display">
          <span className="row">
            <span>Designer <em>d'expériences</em><Sparkles className="illus-inline illus-hero-spark" size={72} /></span>
          </span>
        </h1>

        <div className="hero-after reveal">
          <div>
            <p className="lede">{D.hero.intro}</p>
          </div>
          <div className="hero-portrait-col">
            <div className="hero-portrait">
              <img src="images/portrait.jpeg" alt="Océlia, UX/UI Designer" className="portrait-img" />
            </div>
            <p className="hero-promise">{D.hero.promise}</p>
            <a className="portrait-contact" href="mailto:oceliabrf@gmail.com">
              <span>Me contacter</span>
              <span className="portrait-contact-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>);

}

/* ===== Hero Meta band ===== */
function HeroMeta() {
  return (
    <section className="hero-meta-band">
      <div className="container">
        <div className="hero-meta">
          <div className="hero-meta-col">
            <span className="hero-meta-label">Localisation</span>
            <p>{D.hero.location}<br />Missions à distance ou sur site</p>
          </div>
          <div className="hero-meta-col">
            <span className="hero-meta-label">Spécialités</span>
            <p>User research, UI design, facilitation, mentorat</p>
          </div>
          <div className="hero-meta-col">
            <span className="hero-meta-label">Disponibilité</span>
            <p>{D.hero.availability} en freelance</p>
          </div>
        </div>
      </div>
    </section>);

}

/* ===== Marquee ===== */
function Marquee() {
  const items = [
  "User Research", "Prototypage",
  "Direction artistique", "Accessibilité", "Éco-conception",
  "Stratégie produit", "Facilitation"];

  const Run = () =>
  <span>
      {items.map((it, i) =>
    <React.Fragment key={i}>
          <em>{it}</em>
          <span className="star">✦</span>
        </React.Fragment>
    )}
    </span>;

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Run /><Run />
      </div>
    </div>);

}

/* ===== Projects list ===== */
function Projects({ onOpen, onOpenArchive }) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <header className="s-head reveal">
          <div>
            <div className="num">01 — PROJETS</div>
           <h2 className="h2"><Squiggle className="illus-inline illus-head" size={64} />Missions <em className="accent-em">clients</em>.</h2>
          </div>
          
          <p>
             Un cadre de travail sur-mesure, adapté selon les enjeux et la culture produit de mes clients, pour des acteurs de l'énergie, de la banque, du secteur public et de la santé. </p>
        </header>

        <div className="projects">
          {D.projects.map((p, i) =>
          <article key={p.id} className="project reveal">
              <div className="project-text">
                <div className="project-meta">
                  <span>{p.year}</span>
                </div>
                <h3 className="project-title">
                  <button className="project-link" onClick={() => onOpen(p)}>{p.title}</button>
                </h3>
                <p className="body">{p.summary}</p>
                <div className="project-tags">
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <span className="project-cta" aria-hidden="true">
                  Voir le projet <span className="arrow">→</span>
                </span>
              </div>
            </article>
          )}
        </div>

        {D.archive && D.archive.length > 0 &&
        <article className="project archive-card reveal">
            <div className="project-text">
              
              <h3 className="project-title">
                <button className="project-link" onClick={() => onOpenArchive(true)}>Autres missions</button>
              </h3>
              <p className="body">Des interventions plus courtes, audits, cadrages, refontes ponctuelles, sur des secteurs variés. Tous les noms de clients ont été anonymisés.</p>
              <div className="project-tags">
                {[...new Set(D.archive.map((a) => a.sector.replace(/\s*\(anonymisé\)/, '')))].slice(0, 4).map((s) =>
              <span key={s} className="tag">{s}</span>
              )}
              </div>
              <span className="project-cta" aria-hidden="true">
                Voir les archives <span className="arrow">→</span>
              </span>
            </div>
          </article>
        }
      </div>
    </section>);

}

/* ===== About ===== */
function About() {
  return (
    <section id="about" className="section" style={{ background: "var(--bg-alt)" }}>
      <div className="container">
        <header className="s-head reveal">
          <div>
            <div className="num">02 — Approche</div>
            <h2 className="h2"><Burst className="illus-inline illus-contact" size={32} />Mon <em className="accent-em">savoir-faire</em>.</h2>
          </div>
          <p className="lede">J'interviens de la phase de cadrage à la conception fonctionnelle, afin de garantir la cohérence entre les besoins des parties prenantes et les livrables.</p>
        </header>

        <div className="process reveal">
          {D.process.map((p) =>
          <article key={p.num} className="step">
              <div className="step-num">{p.num}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
              <ul className="step-bullets">
                {p.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              
            </article>
          )}
        </div>

            <div className="about-skills reveal">
                    <div className="skills-section">
            <div className="skills-section-label">
              <span className="dot dot-outline"></span>
              Outils
            </div>
            <ul className="skills-list">
              {D.toolbox.map((g) =>
              <li key={g.group} className="skills-row skills-row--tool">
                <span className="skills-row-label">{g.group}</span>
                <span className="skills-row-items">
                  {g.items.map((name, i) =>
                  <React.Fragment key={name}>
                    <span>{name}</span>
                    {i < g.items.length - 1 && <span className="sep">·</span>}
                  </React.Fragment>
                  )}
                </span>
              </li>
              )}
              <li className="skills-row skills-row--tool">
                <span className="skills-row-label">Langues</span>
                <span className="skills-row-items">
                  {D.languages.map(([name, level], i) =>
                  <React.Fragment key={name}>
                    <span>{name} <span style={{ color: "var(--muted)" }}>({level})</span></span>
                    {i < D.languages.length - 1 && <span className="sep">·</span>}
                  </React.Fragment>
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>);

}

/* ===== Archive ===== */
function Archive() {
  if (!D.archive || !D.archive.length) return null;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <header className="s-head reveal">
          <div>
            <div className="num">— Archive</div>
            <h2 className="h2">Autres <em className="accent-em">missions</em><Burst className="illus-inline illus-head" size={42} />.</h2>
          </div>
          <p className="lede">Des interventions plus courtes, en audit ou en cadrage, sur des secteurs variés. Tous les noms de clients ont été anonymisés.</p>
        </header>
        <div className="archive-list reveal">
          {D.archive.map((a, i) =>
          <article key={i} className="archive-row">
              <div className="archive-num">{String(i + 4).padStart(2, "0")}</div>
              <div className="archive-main">
                <h4 className="archive-title">{a.title}</h4>
                <p className="archive-desc">{a.summary}</p>
              </div>
              <div className="archive-meta">
                <div>{a.sector}</div>
                <div>{a.year} · {a.duration}</div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}

/* ===== Experience ===== */
function Experience() {
  return (
    <section id="parcours" className="section">
      <div className="container">
        <header className="s-head reveal">
          <div>
            <div className="num">03 — Parcours</div>
            <h2 className="h2"><Loop className="illus-inline illus-head illus-loop-head" size={64} />Là où j'ai <em className="accent-em">appris</em>.</h2>
          </div>
          <p className="lede">8 ans de pratique, principalement chez CGI sur des projets B2B et secteur public à fort enjeu.</p>
        </header>

        <div className="parcours-grid reveal">
          <div className="parcours-label parcours-label--exp">Expérience</div>
          <div className="parcours-label parcours-label--edu">Formation</div>

          {D.experience.map((e, i) =>
          <div
            key={e.date}
            className={"tl-item tl-item--exp" + (i === 0 ? " is-first" : "") + (i === D.experience.length - 1 ? " is-last" : "")}
            style={{ "--r": i }}>
              <div className="tl-date">{e.date}</div>
              <div>
                <h4 className="tl-role">{e.role}</h4>
                <div className="tl-place">{e.place}</div>
              </div>
              <div className="tl-tag">{e.tag}</div>
            </div>
          )}

          {D.education.map((e, i) =>
          <div
            key={e.title}
            className={"tl-item tl-item--edu" + (i === 0 ? " is-first" : "") + (i === D.education.length - 1 ? " is-last" : "")}
            style={{ "--r": i }}>
              <div className="tl-date">{e.date}</div>
              <div>
                <h4 className="tl-role">{e.title}</h4>
                <div className="tl-place">{e.place}</div>
              </div>
            </div>
          )}
        </div>

        <div className="parcours-certifs reveal">
          <div className="parcours-certifs-label">
            <span className="dot"></span>
            Certifications
          </div>
          <ul className="parcours-certifs-list">
            {D.certifications.map((c) =>
            <li key={c.label}>
              <a href={c.url} target="_blank" rel="noopener noreferrer">{c.label}</a>
            </li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}

/* ===== Contact ===== */
function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="reveal">
          <div className="caption" style={{ marginBottom: 24 }}>04 — Contact</div>
          <h2 className="display">
            On en <em>parle</em> ?
          </h2>
          <p className="lede">
            Une mission à cadrer, un produit à refondre, une équipe à accompagner ?
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="mailto:oceliabrf@gmail.com">
                            oceliabrf@gmail.com
              <span>→</span>
            </a>
           
          </div>
        </div>
      </div>
    </section>);

}

/* ===== Footer ===== */
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>© 2026 Océlia - UX/UI Designer freelance · Lyon</div>
        <div className="links">
          <a href="https://www.linkedin.com/in/oceliab/">LinkedIn</a>
          <a href="https://www.behance.net/ocelia?locale=fr_FR">Behance</a>
          <a href="#top">Retour en haut ↑</a>
        </div>
      </div>
    </footer>);

}

/* ===== Archive modal ===== */
function ArchiveModal({ open, onClose }) {
  const dialogRef = useDialog(open, onClose);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-modal-title"
        tabIndex={-1}>
        <div className="modal-head">
          <span className="caption">Archive — {D.archive.length} missions</span>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="modal-body">
          <h2 id="archive-modal-title" className="h2" style={{ marginBottom: 16 }}>Autres <em className="accent-em">missions</em>.</h2>
          <p className="lede" style={{ marginBottom: 48 }}>Des interventions plus courtes (audits, cadrages, refontes ponctuelles) sur des secteurs variés.</p>
          <div className="archive-list">
            {D.archive.map((a, i) =>
            <article key={i} className="archive-row">
                <div className="archive-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="archive-main">
                  <h4 className="archive-title">{a.title}</h4>
                  <p className="archive-desc">{a.summary}</p>
                </div>
                <div className="archive-meta">
                  <div>{a.sector}</div>
                  <div>{a.year} · {a.duration}</div>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>);
}

/* ===== Project modal ===== */
function ProjectModal({ project, onClose }) {
  const dialogRef = useDialog(!!project, onClose);

  if (!project) return null;
  const idx = D.projects.findIndex((p) => p.id === project.id);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-modal-title"
        tabIndex={-1}>
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="caption">Étude de cas — {String(idx + 1).padStart(2, "0")}</span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="modal-body">
          <h2 id="case-modal-title" className="h2" style={{ marginBottom: 16 }}>{project.title}</h2>
          <p className="lede" style={{ marginBottom: 40 }}>{project.lede || project.summary}</p>

          <div className="case-grid">
            <aside className="case-meta">
              <dl>
                <div><dt>Client</dt><dd>{project.client}</dd></div>
                <div><dt>Année</dt><dd>{project.year}</dd></div>
                <div><dt>Rôle</dt><dd>{project.role}</dd></div>
                <div><dt>Durée</dt><dd>{project.duration}</dd></div>
                <div><dt>Discipline</dt><dd>{project.tags.join(", ")}</dd></div>
              </dl>
            </aside>
            <div className="case-content">
              <h4>Le contexte</h4>
              <p>{project.context}</p>

              <h4>La problématique</h4>
              <p className="case-problematic">{project.problematic}</p>

              {project.demarche && <><h4>La démarche</h4>
              {project.demarcheIntro && <p>{project.demarcheIntro}</p>}
              <ol className="case-steps">
                {project.demarche.map((s) =>
                <li key={s.num} className="case-step">
                  <div className="case-step-head">
                    <span className="case-step-num">{s.num}</span>
                    <h5 className="case-step-title">{s.title}</h5>
                  </div>
                  <p className="case-step-body">{s.body}</p>
                </li>
                )}
              </ol></>}

              {!project.hideImages && <><div className={"case-hero" + (project.naturalImages ? " is-natural" : "")}>
                <img
                  src={`images/case-studies/${project.id}-hero.png`}
                  alt={`${project.title} — visuel principal`}
                  onError={(e) => {e.currentTarget.classList.add("img-missing");}} />
              </div>
              <div className={"case-imgs" + (project.naturalImages ? " is-natural" : "")}>
                <div>
                  <img
                    src={`images/case-studies/${project.id}-1.png`}
                    alt={`${project.title} — capture 1`}
                    onError={(e) => {e.currentTarget.classList.add("img-missing");}} />
                </div>
                <div>
                  <img
                    src={`images/case-studies/${project.id}-2.png`}
                    alt={`${project.title} — capture 2`}
                    onError={(e) => {e.currentTarget.classList.add("img-missing");}} />
                </div>
              </div></>}

              {project.solution && <><h4>La solution</h4>
              <p>{project.solution}</p></>}

              {project.delivered && <><h4>Les livrables</h4>
              <ul>{project.delivered.map((a) => <li key={a}>{a}</li>)}</ul></>}

              {project.impact && <><h4>L'impact</h4>
              <div className="stats" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: 20 }}>
                {project.impact.map(([n, l]) =>
                <div key={l} className="stat">
                    <div className="num"><em>{n}</em></div>
                    <div className="label">{l}</div>
                  </div>
                )}
              </div></>}
            </div>
          </div>
        </div>
      </div>
    </div>);

}

/* ===== App ===== */
function App() {
  const [openProject, setOpenProject] = useState(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  useReveal();

  return (
    <>
      <CustomCursor />
      <Nav />
      <Hero />
      <Marquee />
      <HeroMeta />
      <Projects onOpen={setOpenProject} onOpenArchive={setArchiveOpen} />
      <About />   
      <Experience />
      <Contact />
      <Footer />
      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      <ArchiveModal open={archiveOpen} onClose={() => setArchiveOpen(false)} />
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);