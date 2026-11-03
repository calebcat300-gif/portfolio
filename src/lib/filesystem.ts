
export type FSNode =
    | { type: "directory"; children: Record<string, FSNode> }
    | { type: "file"; content: string }
    | { type: "link"; url: string };

const file = (content: string): FSNode => ({
    type: "file",
    content,
});

const folder = (children: Record<string, FSNode>): FSNode => ({
    type: "directory",
    children,
});

const link = (url: string): FSNode => ({
    type: "link",
    url,
});

type TechGroup = {
    workedWith: string[];
    planned: string[];
};

export const technologies: Record<string, TechGroup> = {
    "programming-languages": {
        workedWith: [
            "typescript",
            "x86/x64 assembly",
            "c++",
            "c",
            "python",
            "javascript",
            "lua",
            "bash",
            "powershell",
            "windows batch",
            "autohotkey",
            "sql",
        ],
        planned: [
            "go",
            "ptx assembly",
            "cuda c++",
            "glsl",
            "hip",
            "metal shading language (msl)",
        ],
    },

    "web-development": {
        workedWith: [
            "react",
            "vue",
            "node.js",
            "vite",
            "three.js",
            "webgl",
            "html",
            "css",
            "tailwind css",
        ],
        planned: [],
    },

    databases: {
        workedWith: [
            "sqlite",
            "postgresql",
            "mongodb",
            "mysql",
            "redis",
        ],
        planned: [],
    },

    "linux-distributions": {
        workedWith: [
            "arch linux",
            "gentoo",
            "void linux",
            "artix linux",
            "cachyos",
            "bedrock linux",
        ],
        planned: [],
    },

    "systems-development": {
        workedWith: [
            "docker",
            "nix",
            "git",
            "cmake",
            "ghidra",
            "binary ninja",
        ],
        planned: [],
    },

    "local-ai-ml": {
        workedWith: [
            "sglang",
            "ollama",
            "llama.cpp",
            "cuda",
            "pytorch",
            "tensorflow",
            "openai-compatible apis",
        ],
        planned: [
            "ggml",
            "vulkan",
            "metal",
            "hip",
        ],
    },

    "creative-software": {
        workedWith: [
            "blender",
            "adobe after effects",
        ],
        planned: [],
    },

    "desktop-development": {
        workedWith: [
            "tauri",
        ],
        planned: [],
    },
};

function formatTechGroup(name: string, group: TechGroup) {
    const lines = [
        name.replaceAll("-", " "),
        "",
        "worked with:",
        ...group.workedWith.map((tech) => `  ${tech}`),
    ];

    if (group.planned.length) {
        lines.push(
            "",
            "planned:",
            ...group.planned.map((tech) => `  ${tech}`),
        );
    }

    return lines.join("\n");
}

const stackFiles: Record<string, FSNode> = {};

for (const [name, group] of Object.entries(technologies)) {
    stackFiles[`${name}.md`] = file(
        formatTechGroup(name, group),
    );
}

stackFiles["readme.md"] = file(
    [
        "technologies i've worked with",
        "",
        ...Object.entries(technologies).map(
            ([name, group]) => formatTechGroup(name, group),
        ),
        "",
        "source: endorphins.wiki",
    ].join("\n\n"),
);

stackFiles["source.url"] = link(
    "https://endorphins.wiki/",
);

const aboutMe = `
hey, i'm endorphins.

i'm a developer interested in low-level programming,
linux, reverse engineering, artificial intelligence,
and high-performance software.

my interests span systems programming, ai coding
harnesses, local language model inference, gpu
optimization, desktop software, and web development.

i've worked with languages including typescript,
javascript, c, c++, python, and x86/x64 assembly,
alongside a range of frameworks and development tools.

i enjoy experimenting with linux distributions,
understanding how software works beneath the surface,
and building projects around the things i'm learning.

one of my main projects is bare, an open-source,
local-first ai coding harness.

bare focuses on terminal-based interaction, efficient
context management, model integration, and reliable
agentic coding workflows.

bear is the planned native inference engine associated
with bare. its research focuses on performance,
memory efficiency, and hardware-level optimization.

i'm particularly interested in cuda c++, ptx,
gpu kernels, and the mathematics behind machine
learning as areas for further development.

you can explore my technology stack with 'stack',
or see my projects with 'projects'.

website: https://endorphins.wiki/
`.trim();

const bareReadme = `
bare
open-source / local-first / ai coding harness

bare is a terminal-first ai coding harness currently
in development.

the project is designed around a minimal interactive
interface for working with local and remote ai models.

features and development goals include:

  interactive terminal ui
  streaming responses
  model reasoning support
  tool execution
  file editing
  local model apis
  remote model apis
  conversation history
  context management
  agentic coding workflows

reliability-focused roadmap:

  prevent lost task context
  reduce repeated failures
  avoid conflicting edits
  verify completed results
  optimize token usage
  minimize runtime overhead

the goal is to make an efficient, extensible coding
environment while maintaining model capability.

the planned native inference engine, bear, explores
speed, memory efficiency, and hardware-level
optimization.

status: in development

github:
https://github.com/calebcat300-gif/bare
`.trim();

const bareTechnology = `
bare technology stack

current / integrated:

  typescript
  react
  ink
  node.js
  sharp

additional project roadmap / research:

languages:
  javascript
  c++
  c
  python
  go
  sql
  bash
  x86-64 assembly
  ptx assembly
  cuda c++
  glsl
  hip
  metal shading language (msl)

frameworks, libraries and runtimes:
  ink-text-input
  ink-use-mouse
  ggml
  llama.cpp

gpu and inference:
  cuda
  vulkan
  metal
  hip
  sglang
  ollama

data and development:
  sqlite
  cmake
  openai-compatible apis
  git

research and planned technologies are not necessarily
implemented or integrated.
`.trim();

const bearReadme = `
bear
native inference engine / research phase

bear is the planned native inference engine associated
with the bare ai coding harness.

the research focuses on:

  local language model inference
  inference throughput
  gpu optimization
  memory efficiency
  kv-cache optimization
  efficient prompt processing
  hardware-aware performance
  cpu and gpu utilization
  benchmarking and profiling

areas of research include:

  cuda c++
  ptx assembly
  c++
  native inference backends
  custom gpu kernels
  memory management
  model execution optimization

the goal is to explore how far local hardware can
be pushed through careful software engineering.

status: research phase

bear is not yet a completed inference engine.
`.trim();

export const filesystem: FSNode = folder({
    "readme.md": file(
        [
            "endorphins",
            "",
            "welcome to my website.",
            "",

            "",
            "about-me/   information about me",
            "projects/   software projects",
            "stack/      technologies i've worked with",
            "contact/    links and socials",
            "",
            "try:",
            "  cat readme.md",
            "  about-me",
            "  projects",
            "  stack",
            "  dolphin",
            "",
            "type 'help' for terminal commands.",
        ].join("\n"),
    ),

    "about-me": folder({
        "readme.md": file(aboutMe),

        "interests.md": file(
            [
                "interests",
                "",
                "low-level programming",
                "linux",
                "reverse engineering",
                "systems programming",
                "artificial intelligence",
                "local llm inference",
                "gpu programming and optimization",
                "high-performance software",
                "desktop development",
                "web development",
                "machine learning mathematics",
            ].join("\n"),
        ),

        "website.url": link(
            "https://endorphins.wiki/",
        ),
    }),

    projects: folder({
        "readme.md": file(
            [
                "projects",
                "",
                "bare/",
                "  open-source local-first ai coding harness",
                "  status: in development",
                "",
                "bear/",
                "  planned native inference engine",
                "  status: research phase",
                "",
                "deskpilot/",
                "  c++ desktop automation agent",
                "",
                "enter a project directory to read more.",
            ].join("\n"),
        ),

        bare: folder({
            "readme.md": file(bareReadme),

            "technology.md": file(bareTechnology),

            "github.url": link(
                "https://github.com/calebcat300-gif/bare",
            ),
        }),

        bear: folder({
            "readme.md": file(bearReadme),

            "research.md": file(
                [
                    "bear research",
                    "",
                    "native inference",
                    "cuda and gpu kernels",
                    "ptx assembly",
                    "memory optimization",
                    "model throughput",
                    "kv-cache management",
                    "hardware-aware optimizations",
                    "benchmarking",
                    "",
                    "status: planned / research",
                ].join("\n"),
            ),
        }),

        deskpilot: folder({
            "readme.md": file(
                [
                    "deskpilot",
                    "",
                    "a c++ desktop automation agent.",
                    "",
                    "focused on interacting with desktop",
                    "applications and controlling the",
                    "graphical environment.",
                ].join("\n"),
            ),

            "github.url": link(
                "https://github.com/calebcat300-gif/deskpilot",
            ),
        }),
    }),

    stack: folder(stackFiles),

    contact: folder({
        "readme.md": file(
            [
                "find me on",
                "",
                "github",
                "  https://github.com/calebcat300-gif",
                "",
                "codeberg",
                "  https://codeberg.org/endorphins",
                "",
                "hugging face",
                "  https://huggingface.co/endorphinss",
                "",
                "website",
                "  https://endorphins.wiki/",
            ].join("\n"),
        ),

        "github.url": link("https://github.com/calebcat300-gif"),
        "codeberg.url": link("https://codeberg.org/endorphins"),
        "huggingface.url": link("https://huggingface.co/endorphinss"),
        "website.url": link("https://endorphins.wiki/"),
    }),
});
