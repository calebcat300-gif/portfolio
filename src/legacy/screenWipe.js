// Actual pixels, not an opacity or blur transition. Every frame is 100 ms.
export const FRAME_MS = 100;
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function hash(x, y, step) {
  const v = Math.sin(x * 127.1 + y * 311.7 + step * 74.7) * 43758.5453;
  return v - Math.floor(v);
}

export async function screenWipe(swap = null, signal = undefined) {
  if (reduceMotion()) {
    if (!signal?.aborted) swap?.();
    return;
  }

  const cell = 13;
  const w = Math.ceil(window.innerWidth / cell);
  const h = Math.ceil(window.innerHeight / cell);
  const overlay = document.createElement("div");
  overlay.className = "pixel-wipe";

  const glow = document.createElement("canvas");
  const front = document.createElement("canvas");
  for (const canvas of [glow, front]) {
    canvas.width = w;
    canvas.height = h;
    canvas.style.imageRendering = "pixelated";
  }
  glow.className = "pixel-wipe-glow";
  front.className = "pixel-wipe-front";
  overlay.append(glow, front);
  document.body.appendChild(overlay);

  const ctx = front.getContext("2d", { alpha: true });
  const bloomCtx = glow.getContext("2d", { alpha: true });
  if (!ctx || !bloomCtx) {
    overlay.remove();
    if (!signal?.aborted) swap?.();
    return;
  }

  function render(mode, progress, tick) {
    ctx.clearRect(0, 0, w, h);
    bloomCtx.clearRect(0, 0, w, h);
    const frontier = progress * (h + 9) - 4;

    for (let x = 0; x < w; x++) {
      const bend = (hash(x, 22, tick) - 0.5) * 6;
      const edge = frontier + bend;

      for (let y = 0; y < h; y++) {
        const n = hash(x, y, tick);
        const covered = mode === "close" ? y <= edge : y >= edge;
        const near = Math.abs(y - edge) < 4;

        if (covered) {
          ctx.fillStyle = "#050505";
          ctx.fillRect(x, y, 1, 1);
        }

        // Irregular gray blocks at the boundary. Only bright ones bloom.
        if (near && n > 0.43) {
          const bright = n > 0.92;
          ctx.fillStyle = bright ? "#f2f2f2" : n > 0.74 ? "#909090" : "#393939";
          ctx.fillRect(x, y, 1, 1);
          if (bright) {
            bloomCtx.fillStyle = "#fafafa";
            bloomCtx.fillRect(x, y, 1, 1);
          }
        }
      }
    }
  }

  const STEPS = 9;
  async function run(mode) {
    for (let step = 0; step <= STEPS; step++) {
      if (signal?.aborted) return false;
      render(mode, step / STEPS, step);
      await sleep(FRAME_MS);
    }
    return !signal?.aborted;
  }

  try {
    if (swap) {
      if (!(await run("close"))) return;
      if (signal?.aborted) return;
      swap();
    }
    await run("open");
  } finally {
    overlay.remove();
  }
}

export async function revealAscii(pre, signal = undefined) {
  if (!pre || signal?.aborted || reduceMotion()) return;

  const wrap = pre.parentElement;
  const rect = pre.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));

  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const sourceCtx = source.getContext("2d");
  if (!sourceCtx) return;

  const computed = getComputedStyle(pre);
  const fontSize = parseFloat(computed.fontSize);
  const lineHeight = parseFloat(computed.lineHeight) || fontSize * 1.2;
  sourceCtx.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
  sourceCtx.textBaseline = "top";
  sourceCtx.fillStyle = "#f1f1f1";
  pre.textContent.split("\n").forEach((line, i) => {
    sourceCtx.fillText(line, 0, i * lineHeight);
  });

  const output = document.createElement("canvas");
  output.className = "ascii-pixel-layer";
  output.width = width;
  output.height = height;
  wrap.appendChild(output);
  const ctx = output.getContext("2d");
  if (!ctx) { output.remove(); return; }
  const steps = [22, 22, 16, 13, 10, 8, 6, 4, 3, 2, 1];
  pre.style.visibility = "hidden";

  try {
    for (let i = 0; i < steps.length; i++) {
      if (signal?.aborted) break;
      const block = steps[i];
      const low = document.createElement("canvas");
      low.width = Math.max(1, Math.ceil(width / block));
      low.height = Math.max(1, Math.ceil(height / block));
      low.getContext("2d").drawImage(source, 0, 0, low.width, low.height);
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(low, 0, 0, width, height);

      // A few missing monochrome cells gradually resolve, without fading.
      if (block > 1) {
        const chance = 0.36 * (1 - i / steps.length);
        const size = Math.max(4, block);
        for (let y = 0; y < height; y += size) {
          for (let x = 0; x < width; x += size) {
            if (hash(x, y, i) < chance) {
              ctx.fillStyle = "#050505";
              ctx.fillRect(x, y, size, size);
            }
          }
        }
      }
      await sleep(FRAME_MS);
    }
  } finally {
    pre.style.visibility = "visible";
    output.remove();
  }
}
