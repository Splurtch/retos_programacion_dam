import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { InternationalizationProvider } from '@astryxdesign/core/i18n';
import esES from '@astryxdesign/core/locales/es-ES.json';
import { App, type Tema } from './App.tsx';
import { guardar, leer } from './ui/guia.tsx';
import './styles.css';

function Raiz() {
  const [tema, setTema] = useState<Tema>(() => leer('tema', 'dark'));
  useEffect(() => {
    if (tema === 'system') delete document.documentElement.dataset.tema;
    else document.documentElement.dataset.tema = tema;
    guardar('tema', tema);
  }, [tema]);
  return (
    <Theme theme={neutralTheme} mode={tema}>
      <InternationalizationProvider locale="es-ES" messages={{ 'es-ES': esES }}>
        <App tema={tema} setTema={setTema} />
      </InternationalizationProvider>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Raiz /></StrictMode>);
