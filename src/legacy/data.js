// Edit everything visitors see about you here.
// Only links you've actually published are included.
export const profile = {
  name: "endorphins",
  intro: "I build software, experiment with local AI, and care about how interfaces feel.",
  about: [
    "I'm endorphins. Most of my time goes into programming, figuring out how systems work, and making interfaces that don't feel interchangeable.",
    "I'm especially interested in low-level programming, local language models, inference performance, desktop software, and the intersection of design and engineering.",
    "This site is part of that experimentation: a Linux-inspired boot, an interactive shell, and a different kind of portfolio behind it."
  ],
  github: "https://github.com/calebcat300-gif",
  discord: "https://discord.com/users/1439728287608999956"
};

export const projects = [
  {
    slug: "bare",
    name: "bare",
    category: "AI tooling",
    summary: "A terminal-first coding harness built around working with local models.",
    description: "A minimal coding environment with a terminal UI, interactive tools, and an emphasis on making local models useful for actual development work.",
    paragraphs: [
      "bare is my take on a coding harness that stays close to the terminal. The interface is built with React and Ink, with a focus on clarity and fast interaction rather than a heavyweight desktop shell.",
      "The long-term direction is a tighter local-model workflow and a separate inference engine called bear. Both are ongoing projects, not finished products."
    ],
    technologies: ["TypeScript", "React", "Ink", "Local LLMs"],
    link: "https://github.com/calebcat300-gif/bare",
    status: "In development",
    motif: "terminal"
  },
  {
    slug: "deskpilot",
    name: "deskpilot",
    category: "Desktop automation",
    summary: "An experimental desktop agent exploring application and cursor control.",
    description: "A C++ desktop-agent project exploring how software can observe and interact with a graphical environment.",
    paragraphs: [
      "deskpilot is where I explore desktop automation from a lower-level perspective. The project is centered on application interaction, cursor control, and the mechanics behind a desktop agent.",
      "It's an experiment in systems programming and agent design rather than a polished consumer application."
    ],
    technologies: ["C++", "Linux", "Automation"],
    link: "https://github.com/calebcat300-gif/deskpilot",
    status: "Experimental",
    motif: "cursor"
  },
  {
    slug: "ascent-launcher",
    name: "Ascent Launcher",
    category: "Desktop interface",
    summary: "A desktop game launcher with a custom interface and authentication flow.",
    description: "A desktop launcher combining a web-based interface with Tauri's native application shell.",
    paragraphs: [
      "Ascent Launcher explores the point where desktop software and web interfaces meet. I've worked on the navigation, video-driven home screen, authentication flow, and presentation of game builds.",
      "The visual direction is restrained, dark, and glass-like without relying on loud outlines or unnecessary UI."
    ],
    technologies: ["Tauri", "React", "TypeScript", "CSS"],
    link: null,
    status: "Project work",
    motif: "window"
  },
  {
    slug: "remix-launcher",
    name: "Remix Launcher",
    category: "Web and desktop UI",
    summary: "A launcher interface exploring motion, typography, and game-oriented navigation.",
    description: "A launcher project with a custom UI, video backgrounds, and an emphasis on the details of interaction.",
    paragraphs: [
      "Remix Launcher started as an interface project built with React, Vite, and Tailwind CSS. It's where I experimented with large type, moving backgrounds, and a more cinematic presentation.",
      "I spent time refining little things like button weight, the treatment of video, and the way navigation feels."
    ],
    technologies: ["React", "Vite", "Tailwind CSS"],
    link: "https://github.com/RemixOG/Remix-Launcher",
    status: "Project work",
    motif: "grid"
  }
];

export const stack = [
  { title: "Languages", note: "Writing and learning", items: ["C", "C++", "Rust", "JavaScript", "TypeScript", "Python"] },
  { title: "Interfaces", note: "Building with", items: ["React", "Ink", "Vite", "Tauri", "HTML", "CSS"] },
  { title: "AI systems", note: "Using and exploring", items: ["llama.cpp", "SGLang", "CUDA", "PTX", "Local inference"] },
  { title: "Environment", note: "Everyday tools", items: ["Arch Linux", "Git", "Neovim", "Blender"] }
];
