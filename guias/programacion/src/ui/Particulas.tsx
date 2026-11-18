import { useEffect } from 'react';

/*
  Logo de partículas de DigitalSynapse (port del particle-logo.js de digitalsynapse.es).
  Si hay un [data-particulas-ancla] en pantalla (portada del índice), las partículas forman
  el isotipo en ese hueco; al bajar o al entrar en una lámina se abren a dos franjas laterales
  estrechas y tenues, para no competir con la lectura. Lienzo fijo detrás de todo: paneles,
  código y tarjetas tienen fondo propio y lo tapan. Con reduced-motion no se pinta nada.
  ponytail: Canvas 2D aguanta ~1.4k partículas; para más pasar a WebGL.
*/
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="240" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset=".5" stop-color="#8B5CF6"/><stop offset="1" stop-color="#06B6D4"/></linearGradient></defs><path d="M6 10L16 4L26 10L6 22L16 28L26 22" stroke="url(#g)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="10" r="3.5" fill="#3B82F6"/><circle cx="16" cy="16" r="3.5" fill="#8B5CF6"/><circle cx="26" cy="22" r="3.5" fill="#06B6D4"/></svg>`;
const N = 240;
const TAU = Math.PI * 2;
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface P { u: number; v: number; c: string; sx: number; sy: number; ix: number; iy: number; z: number; r: number; ph: number; delay: number }

function oscuro() {
  const t = document.documentElement.dataset.tema;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}

export function Particulas() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let vivo = true;
    const canvas = document.createElement('canvas');
    canvas.className = 'particulas';
    canvas.setAttribute('aria-hidden', 'true');

    const img = new Image();
    img.onload = () => {
      if (!vivo) return;
      const c = document.createElement('canvas');
      c.width = c.height = N;
      const x = c.getContext('2d', { willReadFrequently: true })!;
      x.drawImage(img, 0, 0, N, N);
      const d = x.getImageData(0, 0, N, N).data;
      const narrow = innerWidth < 900;
      const band = narrow ? 0.05 : 0.08;
      let pts: P[] = [];
      for (let py = 0; py < N; py += 2) for (let px = 0; px < N; px += 2) {
        const i = (py * N + px) * 4;
        if (d[i + 3] < 128) continue;
        const u = px / N;
        pts.push({
          u, v: py / N, c: `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`,
          sx: u < 0.5 ? Math.random() * band : 1 - Math.random() * band, sy: Math.random(),
          ix: Math.random(), iy: Math.random(), z: Math.random(),
          r: 0.6 + Math.random() * Math.random() * 1.6, ph: Math.random() * TAU, delay: Math.random() * 0.5,
        });
      }
      for (let j = pts.length - 1; j > 0; j--) { const m = (Math.random() * (j + 1)) | 0; [pts[j], pts[m]] = [pts[m], pts[j]]; }
      pts = pts.slice(0, narrow ? 700 : 1400);

      document.body.appendChild(canvas);
      document.documentElement.dataset.particulas = '';
      const ctx = canvas.getContext('2d')!;
      let W = 0, H = 0, dpr = 1, start = 0, prog = 0;
      const resize = () => {
        dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
      };
      resize();
      addEventListener('resize', resize);

      const frame = (now: number) => {
        if (!start) start = now;
        const t = (now - start) / 1000;
        const ancla = document.querySelector<HTMLElement>('[data-particulas-ancla]');
        const a = ancla?.getBoundingClientRect();
        const box = a && a.width ? { x: a.left, y: a.top, s: a.width } : null;
        // 0 = logo formado en el ancla, 1 = abiertas a los laterales.
        const meta = box ? clamp(-a!.top / (a!.height * 1.1)) : 1;
        prog += (meta - prog) * 0.08;
        const e = prog * prog * (3 - 2 * prog);
        const swoop = Math.sin(e * Math.PI);
        const scroll = scrollY;
        const dark = oscuro();
        // En lectura las franjas son casi un susurro; en claro se pinta sin «lighter».
        const base = lerp(1, narrow ? 0.22 : 0.32, e) * (dark ? 1 : 0.7);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
        for (const p of pts) {
          let intro = clamp((t - p.delay) / 1.4);
          intro = 1 - (1 - intro) ** 3;
          let fy = p.sy - (scroll * (0.1 + 0.3 * p.z)) / H;
          fy = (((fy % 1) + 1) % 1) * 1.1 - 0.05;
          const fx = p.sx * W, fyPx = fy * H + Math.sin(t * 0.5 + p.ph) * 6;
          let px: number, py: number;
          if (box) {
            const bx = box.x + p.u * box.s + Math.sin(t * 0.9 + p.ph) * 0.8;
            const by = box.y + p.v * box.s + Math.cos(t * 0.7 + p.ph) * 0.8;
            px = lerp(lerp(p.ix * W, bx, intro), fx, e);
            py = lerp(lerp(p.iy * H, by, intro), fyPx, e) - swoop * (20 + p.z * 50);
          } else {
            px = lerp(p.ix * W, fx, intro);
            py = lerp(p.iy * H, fyPx, intro);
          }
          ctx.globalAlpha = intro * (0.7 + 0.3 * Math.sin(t * 2 + p.ph)) * base;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, TAU);
          ctx.fill();
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      cleanup = () => removeEventListener('resize', resize);
    };
    let cleanup = () => {};
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVG);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      cleanup();
      canvas.remove();
      delete document.documentElement.dataset.particulas;
    };
  }, []);
  return null;
}
