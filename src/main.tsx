import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ShortApp from './ShortApp';
import App3 from './App3';
import { variant } from './content';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/short.css';
import './styles/v3.css';

/** v1 — повна сторінка (App), short — коротка (ShortApp), v3 — інший дизайн (App3). */
const Page = variant === 'short' ? ShortApp : variant === 'v3' || variant === 'v3dark' ? App3 : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
