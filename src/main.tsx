import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Automatically reload the page when a new service worker takes over
let refreshing = false;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

// Register service worker and check for updates aggressively
registerSW({
  immediate: true,
  onRegistered(r: ServiceWorkerRegistration | undefined) {
    if (r) {
      r.update();
      // Check for updates when the window is focused
      window.addEventListener('focus', () => {
        r.update();
      });
      // Also check every 30 minutes
      setInterval(() => {
        r.update();
      }, 30 * 60 * 1000);
    }
  },
  onRegisterError(error: unknown) {
    console.error('SW registration error', error);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
