import { profile, projects, stack } from "./data.js";

const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

const navItems = [
  ["/work", "work"],
  ["/about", "about"],
  ["/stack", "stack"],
  ["/contact", "contact"]
];

function header(active, light = false) {
  return `<header class="site-header ${light ? "site-header-light" : ""}">
    <a href="/terminal" data-route class="site-brand" aria-label="Go to terminal">endorphins<span class="brand-cursor">_</span></a>
    <nav class="main-nav" aria-label="Main navigation">
      ${navItems.map(([href, name]) => `<a href="${href}" data-route ${active === name ? 'aria-current="page"' : ""}>${name}</a>`).join("")}
    </nav>
    <a href="/terminal" data-route class="shell-link" aria-label="Open terminal"><span aria-hidden="true">&gt;_</span><span class="shell-label"> terminal</span></a>
  </header>`;
}

function footer(light = false) {
  return `<footer class="site-footer ${light ? "site-footer-light" : ""}">
    <span>endorphins</span><span>work in progress.</span><a href="/terminal" data-route>terminal <span aria-hidden="true">↗</span></a>
  </footer>`;
}

function projectMotif(project) {
  if (project.motif === "terminal") return `<div class="project-illustration terminal-illustration" aria-hidden="true">
    <div class="illustration-toolbar"><span>bare</span><span>● &nbsp; ● &nbsp; ●</span></div>
    <pre>$ bare

  ██████╗  █████╗ ██████╗ ███████╗
  ██╔══██╗██╔══██╗██╔══██╗██╔════╝
  ██████╔╝███████║██████╔╝█████╗
  ██╔══██╗██╔══██║██╔══██╗██╔══╝
  ██████╔╝██║  ██║██║  ██║███████╗
  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

  local model ready
  > _</pre>
  </div>`;
  if (project.motif === "cursor") return `<div class="project-illustration cursor-illustration" aria-hidden="true"><div class="cursor-trails"></div><div class="giant-pointer">↖</div><span>deskpilot</span></div>`;
  if (project.motif === "window") return `<div class="project-illustration window-illustration" aria-hidden="true"><div class="window-frame"><div class="window-dots">● ● ●</div><div class="window-word">ASCENT</div><div class="window-button">LAUNCH</div></div></div>`;
  return `<div class="project-illustration remix-illustration" aria-hidden="true"><span>R</span><div class="remix-lines"></div><strong>REMIX</strong></div>`;
}

function work() {
  return `<div class="page light-page" id="page-work">
    ${header("work", true)}
    <main>
      <section class="work-hero">
        <div class="work-hero-side"><p>Code, interfaces, and ideas I've been building.</p><a href="#projects" class="text-link">Explore work <span aria-hidden="true">↓</span></a></div>
        <div class="work-hero-art"><canvas id="work-mosaic" aria-hidden="true"></canvas></div>
        <h1>work<span class="period">.</span></h1>
      </section>
      <section class="project-index" id="projects" aria-label="Projects">
        ${projects.map((project) => `<a data-route href="/work/${project.slug}" class="project-row">
          <span class="project-row-main"><span class="project-row-name">${esc(project.name)}</span><span class="project-row-summary">${esc(project.summary)}</span></span>
          <span class="project-row-end"><span class="project-row-category">${esc(project.category)}</span><span class="project-row-arrow" aria-hidden="true">↗</span></span>
        </a>`).join("")}
      </section>
      <section class="work-outro"><p>There's always something else in progress.</p><a href="/about" data-route class="underlined-link">More about me <span aria-hidden="true">↗</span></a></section>
    </main>
    ${footer(true)}
  </div>`;
}

function about() {
  return `<div class="page dark-page" id="page-about">
    ${header("about")}
    <main>
      <section class="editorial-hero about-hero"><h1>about<span class="period">.</span></h1></section>
      <section class="about-body">
        <h2>I like knowing <em>how it works.</em></h2>
        <div class="about-prose">${profile.about.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      </section>
      <section class="about-focus"><div class="focus-heading">What I'm drawn to</div><div class="focus-list"><p>Software that feels fast.</p><p>Local-first AI tools.</p><p>Low-level systems.</p><p>Interfaces with a point of view.</p></div></section>
      <div class="about-next"><a href="/work" data-route>See the work <span aria-hidden="true">↗</span></a></div>
    </main>
    ${footer()}
  </div>`;
}

function stackPage() {
  return `<div class="page dark-page" id="page-stack">
    ${header("stack")}
    <main>
      <section class="editorial-hero stack-hero"><p class="hero-description">The languages and tools I'm using, learning, and experimenting with.</p><h1>stack<span class="period">.</span></h1></section>
      <section class="stack-list">${stack.map((group) => `<div class="stack-group"><div class="stack-group-heading"><h2>${esc(group.title)}</h2><p>${esc(group.note)}</p></div><div class="stack-items">${group.items.map((item) => `<span>${esc(item)}</span>`).join("")}</div></div>`).join("")}</section>
      
    </main>
    ${footer()}
  </div>`;
}

function contact() {
  return `<div class="page light-page" id="page-contact">
    ${header("contact", true)}
    <main>
      <section class="contact-hero"><div class="contact-intro">Want to talk about code, design, or something you're building?</div><h1>contact<span class="period">.</span></h1></section>
      <section class="contact-links" aria-label="Contact links">
        <a href="${esc(profile.github)}" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span class="contact-handle">calebcat300-gif</span><span aria-hidden="true">↗</span></a>
        <a href="${esc(profile.discord)}" target="_blank" rel="noopener noreferrer"><span>Discord</span><span class="contact-handle">endorphins</span><span aria-hidden="true">↗</span></a>
      </section>
      <p class="contact-footer-note">No contact form. Just places you can actually reach me.</p>
    </main>
    ${footer(true)}
  </div>`;
}

function projectDetail(project) {
  return `<div class="page dark-page" id="page-project">
    ${header("work")}
    <main>
      <section class="detail-hero"><a href="/work" data-route class="detail-back"><span aria-hidden="true">←</span> Back to work</a><div class="detail-heading"><p>${esc(project.category)}</p><h1>${esc(project.name)}<span class="period">.</span></h1><span>${esc(project.status)}</span></div><p class="detail-summary">${esc(project.description)}</p></section>
      <section class="detail-visual">${projectMotif(project)}</section>
      <section class="detail-information"><h2>Inside the project</h2><div class="detail-prose">${project.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div></section>
      <section class="detail-technology"><h2>Built with</h2><div>${project.technologies.map((t) => `<span>${esc(t)}</span>`).join("")}</div></section>
      <section class="detail-bottom">${project.link ? `<a href="${esc(project.link)}" target="_blank" rel="noopener noreferrer">View repository <span aria-hidden="true">↗</span></a>` : `<p>Not publicly linked.</p>`}<a href="/work" data-route>All work <span aria-hidden="true">↗</span></a></section>
    </main>
    ${footer()}
  </div>`;
}

function terminal() {
  return `<div class="page terminal-page" id="page-terminal">
    <header class="terminal-top"><span>endorphins</span><nav aria-label="Quick navigation"><a href="/work" data-route>work</a><a href="/about" data-route>about</a><a href="/stack" data-route>stack</a><a href="/contact" data-route>contact</a></nav><span class="tty-label">tty1</span></header>
    <main class="terminal-main">
      <div class="terminal-welcome"><div class="terminal-welcome-name">endorphins<span>_</span></div><p>${esc(profile.intro)}</p></div>
      <div class="terminal-session" id="terminal-session">
        <pre id="terminal-output" role="log" aria-label="Terminal output" aria-live="polite"></pre>
        <form id="terminal-form" autocomplete="off"><label for="terminal-input">endorphins@endorphins<span class="terminal-punct">:~$</span></label><input id="terminal-input" name="command" type="text" aria-label="Enter terminal command" spellcheck="false" autocapitalize="off" autocomplete="off" autofocus /></form>
      </div>
      <p class="terminal-tip">Try <button type="button" class="inline-command" data-terminal-command="help">help</button>, <button type="button" class="inline-command" data-terminal-command="work">work</button>, or <button type="button" class="inline-command" data-terminal-command="about">about</button>.</p>
    </main>
    <footer class="terminal-footer"><span>endorphins@endorphins</span><span>↑ ↓ for command history</span></footer>
  </div>`;
}

function notFound() {
  return `<div class="page dark-page">${header("")}<main class="notfound"><h1>404<span class="period">.</span></h1><p>Nothing at this address.</p><a href="/terminal" data-route>Back to terminal <span aria-hidden="true">↗</span></a></main>${footer()}</div>`;
}

export function renderPage(path) {
  if (path === "/terminal") return terminal();
  if (path === "/work") return work();
  if (path === "/about") return about();
  if (path === "/stack") return stackPage();
  if (path === "/contact") return contact();
  if (path.startsWith("/work/")) {
    const project = projects.find((item) => item.slug === path.split("/")[2]);
    return project ? projectDetail(project) : notFound();
  }
  return notFound();
}
