import type { SVGProps } from 'react';

// Juego propio de iconos: rejilla 24, trazo 1.75, extremos redondeados. Se pasan a <Icon icon={...}/> de Astryx.
const base = (d: string) =>
  function Svg(p: SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...p}>
        <path d={d} />
      </svg>
    );
  };

export const IcoPaso = base('M6 5v14M10 6l9 6-9 6z');
export const IcoAtras = base('M18 5v14M14 6l-9 6 9 6z');
export const IcoPlay = base('M7 5l12 7-12 7z');
export const IcoPausa = base('M8 5v14M16 5v14');
export const IcoReinicio = base('M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4');
export const IcoBandera = base('M5 21V4M5 4h11l-2 4 2 4H5');
export const IcoLibro = base('M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7');
export const IcoLupa = base('M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4');
export const IcoSol = base('M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z');
export const IcoLuna = base('M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z');
export const IcoMenu = base('M4 7h16M4 12h16M4 17h16');
export const IcoVideo = base('M3 6h12v12H3zM15 10l6-3v10l-6-3');
export const IcoAviso = base('M12 3 2 21h20zM12 10v4M12 17.5v.01');
export const IcoDiana = base('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01');
export const IcoPantalla = base('M3 5h18v11H3zM8 20h8M12 16v4');
export const IcoFlecha = base('M7 17 17 7M8 7h9v9');
export const IcoGithub = base('M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2');
export const IcoLinkedin = base('M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z');
export const IcoSubstack = base('M5 4h14M5 8h14M5 12h14v8l-7-4-7 4z');
export const IcoGlobo = base('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18');
