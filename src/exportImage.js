import { timeToMinutes, COURSE_HUES, SEMESTER } from './schedule'

const FACES_TO_AWAIT = [
  '400 16px "Archivo Black"',
  '400 16px "DM Serif Display"',
  '600 16px "Fredoka"',
  '500 16px "Fredoka"',
  '700 16px "JetBrains Mono"',
  '400 16px "JetBrains Mono"',
  '700 16px "Space Grotesk"',
  '500 16px "Space Grotesk"',
]

const SAMPLE_TEXT =
  "FALL 2026 COURSES ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:·–"

let fontPromise = null

export function ensureExportFonts() {
  if (fontPromise) return fontPromise

  fontPromise = (async () => {
    await Promise.all([
      import("@fontsource/archivo-black/latin-400.css"),
      import("@fontsource/dm-serif-display/latin-400.css"),
      import("@fontsource/fredoka/latin-500.css"),
      import("@fontsource/fredoka/latin-600.css"),
      import("@fontsource/jetbrains-mono/latin-400.css"),
      import("@fontsource/jetbrains-mono/latin-700.css"),
      import("@fontsource/space-grotesk/latin-500.css"),
      import("@fontsource/space-grotesk/latin-700.css"),
    ].map((p) => p.catch(() => null)))

    if (!document.fonts) return false

    await Promise.all(
      FACES_TO_AWAIT.map((spec) => document.fonts.load(spec, SAMPLE_TEXT).catch(() => null)),
    )
    await document.fonts.ready
    return true
  })()

  return fontPromise
}

const STACK = {
  sans: 'system-ui, "Segoe UI", -apple-system, sans-serif',
  mono: 'ui-monospace, "Cascadia Mono", "Segoe UI Mono", "SF Mono", Consolas, monospace',
  serifSystem: 'Georgia, "Times New Roman", serif',
  grotesk: '"Space Grotesk", system-ui, "Segoe UI", sans-serif',
  fredoka: '"Fredoka", "Segoe UI", system-ui, sans-serif',
  dmSerif: '"DM Serif Display", Georgia, "Times New Roman", serif',
  archivo: '"Archivo Black", Impact, "Arial Black", system-ui, sans-serif',
  jetbrains: '"JetBrains Mono", ui-monospace, Consolas, monospace',
}

function byTheme(value, isDark) {
  if (value && typeof value === "object" && ("light" in value || "dark" in value)) {
    return isDark ? value.dark : value.light
  }
  return value
}

export const DESIGNS = [
  {
    id: "classic",
    label: "CLASSIC",
    hues: COURSE_HUES,
    block: "bar", radius: 0, grid: "full", cardAlpha: 1,
    tint: { light: 0.16, dark: 0.24 },
    fonts: { display: STACK.sans, body: STACK.sans, mono: STACK.mono },
    caps: true, tracking: 1,
    headerAlign: "left", dayBand: true, cardBorder: true, cardFill: true,
    background: { type: "veil", strength: 0.55 },
    swatch: ["#2f6bff", "#e0561f", "#17a06a", "#9d4edd"],
  },
  {
    id: "soft",
    label: "SOFT",
    hues: ["#f6b3c8", "#a9dcc9", "#c9bcec", "#f9cfa8", "#aed2ee", "#f5bfbf", "#c8e8bb", "#e6ccf3"],
    block: "fill", radius: 18, grid: "none", cardAlpha: 0.88,
    tint: { light: 1, dark: 1 },
    fonts: { display: STACK.fredoka, body: STACK.fredoka, mono: STACK.fredoka },
    caps: false, tracking: 0, weightDisplay: 600, weightBody: 500,
    headerAlign: "center", dayBand: false, cardBorder: false, cardFill: true,
    background: {
      type: "gradient", angle: "diagonal", force: true,
      from: { light: "#ffe6f0", dark: "#2e2130" },
      to: { light: "#e2f2f8", dark: "#1b2a33" },
    },
    swatch: ["#f6b3c8", "#a9dcc9", "#c9bcec", "#f9cfa8"],
  },
  {
    id: "minimal",
    label: "MINIMAL",
    hues: null,
    block: "edge", radius: 0, grid: "hairline", cardAlpha: 1,
    tint: { light: 0.06, dark: 0.1 },
    fonts: { display: STACK.sans, body: STACK.sans, mono: STACK.mono },
    caps: true, tracking: 5, weightDisplay: 400, weightBody: 400,
    headerAlign: "left", dayBand: false, cardBorder: true, cardFill: true,
    background: { type: "veil", strength: 0.2 },
    swatch: ["#c9c5bb", "#b4b0a6", "#9f9b92", "#8a867d"],
  },
  {
    id: "vivid",
    label: "VIVID",
    hues: ["#1e5eff", "#ff4d1a", "#00b371", "#8b2fe0", "#ffa000", "#00a8c4", "#ff2d78", "#5ea800"],
    block: "fill", radius: 0, grid: "full", cardAlpha: 0.96,
    tint: { light: 1, dark: 1 },
    fonts: { display: STACK.archivo, body: STACK.grotesk, mono: STACK.grotesk },
    caps: true, tracking: 0, weightDisplay: 400, weightBody: 500,
    headerAlign: "left", dayBand: true, cardBorder: true, cardFill: true,
    background: {
      type: "gradient", angle: "vertical", force: true,
      from: { light: "#f0f2fa", dark: "#101018" },
      to: { light: "#d3d9ee", dark: "#2b2442" },
    },
    swatch: ["#1e5eff", "#ff4d1a", "#00b371", "#8b2fe0"],
  },
  {
    id: "mono",
    label: "MONO",
    hues: null,
    block: "bar", radius: 0, grid: "full", cardAlpha: 1,
    tint: { light: 0.18, dark: 0.26 },
    mono: true,
    fonts: { display: STACK.jetbrains, body: STACK.jetbrains, mono: STACK.jetbrains },
    caps: true, tracking: 2, weightDisplay: 700, weightBody: 400,
    headerAlign: "left", dayBand: true, cardBorder: true, cardFill: true,
    background: { type: "accentWash" },
    swatch: ["#a3560c", "#a3560c", "#a3560c", "#a3560c"],
  },
  {
    id: "aurora",
    label: "AURORA",
    hues: ["#4f7cff", "#ff5fa2", "#3ddc97", "#b06cff", "#ffb340", "#33c9e0", "#ff7a5c", "#8ee063"],
    block: "fill", radius: 14, grid: "none", cardAlpha: 0,
    tint: { light: 1, dark: 1 },
    fonts: { display: STACK.grotesk, body: STACK.grotesk, mono: STACK.grotesk },
    caps: true, tracking: 3, weightDisplay: 700, weightBody: 500,
    headerAlign: "center", dayBand: false, cardBorder: false, cardFill: false,
    background: {
      type: "mesh",
      stops: {
        light: ["#b9b0ff", "#ffc0d8", "#a8ead0", "#ffe0a8"],
        dark: ["#6a5cff", "#ff5fa2", "#3ddc97", "#ffb340"],
      },
    },
    swatch: ["#6a5cff", "#ff5fa2", "#3ddc97", "#ffb340"],
  },
  {
    id: "dusk",
    label: "DUSK",
    hues: ["#8fb0ff", "#ffb094", "#93e0c0", "#d3b0ff", "#ffdc94", "#93d9e8", "#ffb0cc", "#c3e89c"],
    block: "bar", radius: 8, grid: "faint", cardAlpha: 0.8,
    tint: { light: 0.26, dark: 0.34 },
    fonts: { display: STACK.dmSerif, body: STACK.sans, mono: STACK.mono },
    caps: false, tracking: 0, weightDisplay: 400,
    headerAlign: "center", dayBand: false, cardBorder: true, cardFill: true,
    background: {
      type: "gradient", angle: "diagonal", force: true,
      from: { light: "#f6e8f0", dark: "#1e1b36" },
      to: { light: "#d9a2b4", dark: "#9c5f79" },
    },
    swatch: ["#221f3d", "#54406a", "#a4657f", "#e0a08c"],
  },
  {
    id: "paper",
    label: "PAPER",
    hues: ["#4f7391", "#9c6249", "#547f60", "#726094", "#9c8646", "#4f818c", "#985d76", "#6d8a46"],
    block: "bar", radius: 0, grid: "hairline", cardAlpha: 0.94,
    tint: { light: 0.16, dark: 0.24 },
    fonts: { display: STACK.serifSystem, body: STACK.serifSystem, mono: STACK.serifSystem },
    caps: false, tracking: 0,
    headerAlign: "left", dayBand: true, cardBorder: true, cardFill: true,
    background: { type: "dots", tint: { light: "#e6dfcc", dark: "#20242a" } },
    swatch: ["#4f7391", "#9c6249", "#547f60", "#726094"],
  },
]

export const EXPORT_PRESETS = [
  { id: "story", label: "STORY", sub: "9:16 · 1080 × 1920", width: 1080, height: 1920 },
  { id: "iphone", label: "LOCK SCREEN", sub: "iPhone · 1290 × 2796", width: 1290, height: 2796 },
  { id: "square", label: "POST", sub: "1:1 · 1080 × 1080", width: 1080, height: 1080 },
  { id: "desktop", label: "DESKTOP", sub: "16:9 · 1920 × 1080", width: 1920, height: 1080 },
]

export function readPalette(theme) {
  const root = document.documentElement
  const original = root.getAttribute("data-theme")
  root.setAttribute("data-theme", theme)

  try {
    const cs = getComputedStyle(root)
    const token = (name) => cs.getPropertyValue(name).trim()

    return {
      isDark: theme === "dark",
      bg: token("--bg"),
      surface: token("--surface"),
      surfaceAlt: token("--surface-alt"),
      text: token("--text"),
      muted: token("--muted"),
      faint: token("--faint"),
      rule: token("--rule"),
      ruleMed: token("--rule-med"),
      accent: token("--accent"),
      fontUi: token("--font-ui"),
      fontData: token("--font-data"),
    }
  } finally {
    if (original) {
      root.setAttribute("data-theme", original)
    } else {
      root.removeAttribute("data-theme")
    }
  }
}

function mixHex(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  const out = pa.map((v, i) => Math.round(v + (pb[i] - v) * t))
  return `rgb(${out[0]}, ${out[1]}, ${out[2]})`
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function fitText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text
  let cut = text
  while (cut.length > 1 && ctx.measureText(cut + "…").width > maxWidth) {
    cut = cut.slice(0, -1)
  }
  return cut.length > 1 ? cut + "…" : ""
}

function luminance(hex) {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

function textOn(hex) {
  return luminance(hex) > 0.45 ? "#16150f" : "#ffffff"
}

function luminanceRgb(r, g, b) {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

function inkAt(ctx, x, y) {
  const d = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data
  return luminanceRgb(d[0], d[1], d[2]) > 0.45 ? "#16150f" : "#ffffff"
}

function roundRectPath(ctx, x, y, w, h, r) {
  if (r > 0 && typeof ctx.roundRect === "function") {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.beginPath()
  ctx.rect(x, y, w, h)
}

function huesFor(design, palette) {
  if (design.hues) return design.hues
  if (design.mono) return new Array(8).fill(palette.accent)
  // MINIMAL: neutral steps between --faint and --muted
  return new Array(8).fill(palette.muted)
}

function drawBackground(ctx, layout, palette, design) {
  const { w, h, s } = layout

  ctx.fillStyle = palette.bg
  ctx.fillRect(0, 0, w, h)

  const bg = design.background
  if (!bg) return

  if (bg.type === "veil") {
    const g = ctx.createRadialGradient(w / 2, h * 0.38, 0, w / 2, h * 0.38, Math.max(w, h) * 0.75)
    const near = mixHex(palette.bg, palette.surface, 0.5 * (bg.strength ?? 0.5))
    const far = mixHex(palette.bg, palette.isDark ? "#000000" : palette.ruleMed, 0.18 * (bg.strength ?? 0.5))
    g.addColorStop(0, near)
    g.addColorStop(1, far)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    return
  }

  if (bg.type === "accentWash") {
    const g = ctx.createLinearGradient(0, 0, w * 0.5, h)
    g.addColorStop(0, mixHex(palette.bg, palette.accent, 0.14))
    g.addColorStop(1, mixHex(palette.bg, palette.accent, 0.03))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    return
  }

  if (bg.type === "gradient") {
    const rawFrom = byTheme(bg.from, palette.isDark)
    const rawTo = byTheme(bg.to, palette.isDark)
    const from = bg.force ? rawFrom : mixHex(palette.bg, rawFrom, palette.isDark ? 0.32 : 0.85)
    const to = bg.force ? rawTo : mixHex(palette.bg, rawTo, palette.isDark ? 0.32 : 0.85)
    const g =
      bg.angle === "vertical"
        ? ctx.createLinearGradient(0, 0, 0, h)
        : ctx.createLinearGradient(0, 0, w * 0.55, h)
    g.addColorStop(0, from)
    g.addColorStop(1, to)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    return
  }

  if (bg.type === "mesh") {
    const stops = byTheme(bg.stops, palette.isDark)
    const alpha = palette.isDark ? 0.55 : 0.75
    const spots = [
      [0.18, 0.12, 0.62], [0.85, 0.22, 0.55],
      [0.22, 0.78, 0.6], [0.8, 0.88, 0.5],
    ]
    spots.forEach(([fx, fy, fr], i) => {
      const cx = w * fx
      const cy = h * fy
      const rad = Math.max(w, h) * fr
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
      g.addColorStop(0, hexToRgba(stops[i % stops.length], alpha))
      g.addColorStop(1, hexToRgba(stops[i % stops.length], 0))
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    })
    return
  }

  if (bg.type === "dots") {
    const tint = byTheme(bg.tint, palette.isDark)
    if (tint) {
      ctx.fillStyle = mixHex(palette.bg, tint, 0.75)
      ctx.fillRect(0, 0, w, h)
    }
    const step = Math.round(26 * s)
    const r = Math.max(1, Math.round(1.6 * s))
    ctx.fillStyle = mixHex(palette.bg, palette.ruleMed, 0.5)
    for (let y = step; y < h; y += step) {
      for (let x = step; x < w; x += step) {
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

function formatHour(hour) {
  const suffix = hour < 12 ? "AM" : "PM"
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:00 ${suffix}`
}

function formatTimeRange(start, end) {
  const short = (t) => {
    const [h, m] = t.split(":").map(Number)
    const display = h % 12 === 0 ? 12 : h % 12
    return `${display}:${String(m).padStart(2, "0")}`
  }
  const half = (t) => (Number(t.split(":")[0]) < 12 ? "AM" : "PM")

  const startHalf = half(start)
  const endHalf = half(end)
  return startHalf === endHalf
    ? `${short(start)}–${short(end)} ${endHalf}`
    : `${short(start)} ${startHalf}–${short(end)} ${endHalf}`
}

function hoursForSchedule(schedule, fallback) {
  const minutes = []
  schedule.forEach((section) => {
    section.meetings.forEach((m) => {
      minutes.push(timeToMinutes(m.start_time), timeToMinutes(m.end_time))
    })
  })
  if (minutes.length === 0) return fallback

  const start = Math.floor(Math.min(...minutes) / 60)
  const end = Math.ceil(Math.max(...minutes) / 60)
  const hours = []
  for (let h = start; h < end; h++) hours.push(h)
  return hours.length > 0 ? hours : fallback
}

function computeLayout(canvas, activeDays, activeHours) {
  const w = canvas.width
  const h = canvas.height
  const s = Math.min(w, h) / 1000

  const pad = Math.round(46 * s)
  const headerH = Math.round(104 * s)
  const footerH = Math.round(52 * s)

  const cardX = pad
  const cardW = w - pad * 2

  const gutterW = Math.round(112 * s)
  const dayHeaderH = Math.round(54 * s)

  const colsX = cardX + gutterW
  const colW = (cardW - gutterW) / activeDays.length

  const availTop = pad
  const availH = h - pad * 2 - footerH

  const idealHourH = colW * 0.8
  const maxBodyH = availH - headerH - dayHeaderH
  const bodyH = Math.min(idealHourH * activeHours.length, maxBodyH)
  const hourH = bodyH / activeHours.length

  const cardH = bodyH + dayHeaderH
  const blockY = availTop + Math.max(0, (availH - headerH - cardH) / 2)
  const headerY = blockY
  const cardY = blockY + headerH
  const bodyY = cardY + dayHeaderH

  return {
    w, h, s, pad,
    headerY, cardX, cardY, cardW, cardH,
    gutterW, dayHeaderH, colsX, colW,
    bodyY, bodyH, hourH,
    slotH: hourH / 12,
    footerH,
  }
}


function drawHeader(ctx, layout, palette, schedule, ink, design, credits) {
  const { s, headerY, cardX, cardW } = layout
  const f = design.fonts
  const caps = design.caps !== false
  const track = design.tracking ?? 1
  const centered = design.headerAlign === "center"
  const originX = centered ? cardX + cardW / 2 : cardX

  ctx.textBaseline = "alphabetic"
  ctx.textAlign = centered ? "center" : "left"

  const title = caps ? SEMESTER.toUpperCase() : SEMESTER
  ctx.fillStyle = ink ?? palette.text
  ctx.font = `${design.weightDisplay ?? 800} ${Math.round(48 * s)}px ${f.display}`
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${Math.round(track * s)}px`
  ctx.fillText(title, originX, headerY + Math.round(48 * s))

  const n = schedule.length
  const word = n === 1 ? "course" : "courses"
  const parts = [`${n} ${word}`]
  if (credits > 0) parts.push(`${credits.toFixed(1)} credits`)
  const line = parts.join(" · ")
  const subtitle = caps ? line.toUpperCase() : line

  ctx.fillStyle = ink ? hexToRgba(ink, 0.72) : palette.muted
  ctx.font = `${design.weightBody ?? 700} ${Math.round(20 * s)}px ${f.mono}`
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${Math.round((track + 1) * s)}px`
  ctx.fillText(subtitle, originX, headerY + Math.round(82 * s))

  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px"
}

export function drawGrid(ctx, layout, palette, activeDays, activeHours, design) {
  const {
    s, cardX, cardY, cardW, cardH,
    gutterW, dayHeaderH, colsX, colW, bodyY, hourH,
  } = layout

  const alpha = design.cardAlpha ?? 1

  // card surface and outer border, mirroring .card in the app
  if (design.cardFill !== false && alpha > 0) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = palette.surface
    ctx.fillRect(cardX, cardY, cardW, cardH)

    // day-header band, mirroring .day-header's
    if (design.dayBand !== false) {
      ctx.fillStyle = palette.surfaceAlt
      ctx.fillRect(cardX, cardY, cardW, dayHeaderH)
    }
    ctx.restore()
  }

  // Grid weight per design: 'none' skips the interior rules entirely.
  const gridStyle = design.grid ?? "full"
  const strength = gridStyle === "hairline" ? 0.35 : gridStyle === "faint" ? 0.28 : 0.62
  const lineW =
    gridStyle === "hairline" ? Math.max(1, Math.round(s)) : Math.max(2, Math.round(2 * s))

  // Hour lines and day dividers: blended from the card surface toward
  // --rule-med, and thick enough to survive being scaled down.
  ctx.strokeStyle = mixHex(palette.surface, palette.ruleMed, strength)
  ctx.lineWidth = lineW
  for (let i = 1; gridStyle !== "none" && i < activeHours.length; i++) {
    const y = Math.round(bodyY + i * hourH) + 0.5
    ctx.beginPath()
    ctx.moveTo(cardX, y)
    ctx.lineTo(cardX + cardW, y)
    ctx.stroke()
  }

  // day column dividers
  for (let i = 1; gridStyle !== "none" && gridStyle !== "faint" && i < activeDays.length; i++) {
    const x = Math.round(colsX + i * colW) + 0.5
    ctx.beginPath()
    ctx.moveTo(x, bodyY)
    ctx.lineTo(x, cardY + cardH)
    ctx.stroke()
  }

  // under the day headers, and right of the time gutter
  if (design.cardBorder !== false) {
    ctx.strokeStyle = palette.ruleMed
    ctx.beginPath()
    ctx.moveTo(cardX, Math.round(bodyY) + 0.5)
    ctx.lineTo(cardX + cardW, Math.round(bodyY) + 0.5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(Math.round(colsX) + 0.5, cardY)
    ctx.lineTo(Math.round(colsX) + 0.5, cardY + cardH)
    ctx.stroke()
  }

  // day labels
  const f = design.fonts
  const caps = design.caps !== false
  const track = design.tracking ?? 1
  ctx.fillStyle = palette.text
  ctx.font = `${design.weightDisplay ?? 800} ${Math.round(22 * s)}px ${f.display}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${Math.round(track * s)}px`
  activeDays.forEach((day, i) => {
    ctx.fillText(caps ? day.toUpperCase() : day, colsX + i * colW + colW / 2, cardY + dayHeaderH / 2)
  })
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px"

  // hour labels down the gutter
  ctx.fillStyle = palette.faint
  ctx.font = `${Math.round(19 * s)}px ${f.mono}`
  ctx.textAlign = "right"
  ctx.textBaseline = "top"
  activeHours.forEach((hour, i) => {
    ctx.fillText(formatHour(hour), colsX - Math.round(12 * s), bodyY + i * hourH + Math.round(8 * s))
  })

  // card border last, so it sits cleanly over every fill
  if (design.cardBorder !== false) {
    ctx.strokeStyle = palette.ruleMed
    ctx.lineWidth = Math.max(2, Math.round(2.5 * s))
    ctx.strokeRect(
      Math.round(cardX) + 0.5,
      Math.round(cardY) + 0.5,
      Math.round(cardW) - 1,
      Math.round(cardH) - 1,
    )
  }
}

export function drawBlocks(ctx, layout, palette, schedule, activeDays, activeHours, design) {
  const { s, colsX, colW, bodyY, slotH, hourH, cardY, cardH } = layout

  const hues = huesFor(design, palette)
  const isFill = design.block === "fill"
  const isEdge = design.block === "edge"
  const radius = Math.round((design.radius ?? 0) * s)
  const tintAlpha = palette.isDark ? design.tint.dark : design.tint.light
  const f = design.fonts

  const byWidth = colW * 0.125
  const byHeight = (hourH * 1.25) / 5.1 // a typical 75-min block, four lines
  const codeSize = Math.max(12, Math.min(46, Math.round(Math.min(byWidth, byHeight))))
  const bodySize = Math.max(11, Math.round(codeSize * 0.76))
  const lineCode = Math.round(codeSize * 1.3)
  const lineBody = Math.round(bodySize * 1.36)

  const gap = Math.max(1, Math.round(2 * s))
  const barW = Math.max(3, Math.round(colW * 0.022))
  const padX = Math.round(codeSize * 0.45)
  const padY = Math.round(codeSize * 0.36)

  schedule.forEach((section, sectionIndex) => {
    const hue = hues[sectionIndex % hues.length]

    section.meetings.forEach((meeting) => {
      const dayIndex = activeDays.indexOf(meeting.day)
      if (dayIndex === -1) return

      const startSlot = (timeToMinutes(meeting.start_time) - activeHours[0] * 60) / 5
      const durationSlots =
        (timeToMinutes(meeting.end_time) - timeToMinutes(meeting.start_time)) / 5

      const x = colsX + dayIndex * colW + gap
      const y = bodyY + startSlot * slotH
      const bw = colW - gap * 2
      const bh = durationSlots * slotH

      // Never let a block escape the card, whatever the data says
      if (y + bh < cardY || y > cardY + cardH) return

      ctx.save()
      roundRectPath(ctx, x, y, bw, bh, radius)
      ctx.clip()

      let bodyColor = palette.muted
      let headColor = palette.text

      if (isFill) {
        ctx.fillStyle = hue
        ctx.fillRect(x, y, bw, bh)
        headColor = textOn(hue)
        bodyColor = hexToRgba(headColor === "#ffffff" ? "#ffffff" : "#16150f", 0.72)
      } else if (isEdge) {
        ctx.fillStyle = hexToRgba(hue, tintAlpha)
        ctx.fillRect(x, y, bw, bh)
        ctx.strokeStyle = hexToRgba(hue, 0.55)
        ctx.lineWidth = Math.max(1, Math.round(1.5 * s))
        ctx.strokeRect(x + 0.5, y + 0.5, bw - 1, bh - 1)
      } else {
        ctx.fillStyle = hexToRgba(hue, tintAlpha)
        ctx.fillRect(x, y, bw, bh)
        ctx.fillStyle = hue
        ctx.fillRect(x, y, barW, bh)
      }

      const inset = isFill || isEdge ? padX : barW + padX
      const textX = x + inset
      const textW = bw - inset - padX
      let cursor = y + padY
      const bottom = y + bh - Math.round(2 * s)

      ctx.textAlign = "left"
      ctx.textBaseline = "top"

      const line = (text, font, color, lineH) => {
        if (cursor + lineH > bottom) return false
        ctx.font = font
        ctx.fillStyle = color
        const shown = fitText(ctx, text, textW)
        if (shown) ctx.fillText(shown, textX, cursor)
        cursor += lineH
        return true
      }

      const code = `${section.courseSubject} ${section.courseCode}-${section.section_number}`
      const wHead = design.weightDisplay ?? 700
      const wBody = design.weightBody ?? 400
      line(code, `${wHead} ${codeSize}px ${f.mono}`, headColor, lineCode)
      line(section.instructor, `${wBody} ${bodySize}px ${f.body}`, bodyColor, lineBody)
      line(
        formatTimeRange(meeting.start_time, meeting.end_time),
        `${wBody} ${bodySize}px ${f.mono}`,
        bodyColor,
        lineBody,
      )
      if (meeting.room) {
        line(meeting.room, `${wBody} ${bodySize}px ${f.mono}`, bodyColor, lineBody)
      }

      ctx.restore()
    })
  })
}

export function drawWatermark(ctx, layout, palette, ink, design) {
  const { s, w, h, pad } = layout

  ctx.fillStyle = ink ? hexToRgba(ink, 0.55) : palette.faint
  ctx.font = `700 ${Math.round(19 * s)}px ${design?.fonts?.mono ?? palette.fontData}`
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${Math.round(3 * s)}px`
  ctx.fillText("aurak-scheduler.com", w / 2, h - pad + Math.round(4 * s))
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px"
}

export function renderSchedule(
  canvas,
  { schedule, activeDays, activeHours, theme, width, height, design: designId, credits = 0 },
) {
  canvas.width = width
  canvas.height = height

  const design = DESIGNS.find((d) => d.id === designId) ?? DESIGNS[0]
  const ctx = canvas.getContext("2d")
  const palette = readPalette(theme)
  const hours = hoursForSchedule(schedule, activeHours)
  const layout = computeLayout(canvas, activeDays, hours)

  drawBackground(ctx, layout, palette, design)

  // With a background painted, the header and watermark sit on it rather than
  // on --bg, so their ink is read off the pixels instead of the theme.
  const headerInk = design.background ? inkAt(ctx, layout.cardX + 4, layout.headerY + 30 * layout.s) : null
  const markInk = design.background ? inkAt(ctx, width / 2, height - layout.pad) : null

  drawHeader(ctx, layout, palette, schedule, headerInk, design, credits)
  drawGrid(ctx, layout, palette, activeDays, hours, design)
  drawBlocks(ctx, layout, palette, schedule, activeDays, hours, design)
  drawWatermark(ctx, layout, palette, markInk, design)
}

export function saveCanvas(canvas, { basename = "schedule", preferShare = true } = {}) {
  return new Promise((resolve) => {
    let settled = false
    const done = (status) => {
      if (!settled) {
        settled = true
        resolve(status)
      }
    }

    const bail = setTimeout(() => done("failed"), 20000)

    const encode = (type, quality) =>
      new Promise((res) => {
        try {
          canvas.toBlob((b) => res(b), type, quality)
        } catch {
          res(null)
        }
      })

    const deliver = (blob) => {
      clearTimeout(bail)
      if (!blob) return done("failed")

      const ext = blob.type === "image/webp" ? "webp" : "png"
      const filename = `${basename}.${ext}`

      let file = null
      try {
        file = new File([blob], filename, { type: blob.type })
      } catch {
        file = null
      }

      if (file && preferShare && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator
          .share({ files: [file] })
          .then(() => done("shared"))
          .catch((err) => done(err && err.name === "AbortError" ? "cancelled" : "failed"))
        return
      }

      try {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        done("downloaded")
      } catch {
        done("failed")
      }
    }

    encode("image/webp", 0.92).then((blob) => {
      if (blob && blob.type === "image/webp") return deliver(blob)
      return encode("image/png").then(deliver)
    })
  })
}

export function canShareFiles() {
  if (!navigator.canShare) return false
  try {
    return navigator.canShare({ files: [new File([new Blob()], "t.png", { type: "image/png" })] })
  } catch {
    return false
  }
}
