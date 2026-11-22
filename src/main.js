import './styles/tactical.css';
import { Battlefield3D } from './three/Battlefield3D.ts';
import { HudController } from './ui/HudController.js';

function bootGame() {
  new HudController();

  const container = document.getElementById('game-container');
  window.__DEFCON_GAME__ = new Battlefield3D(container);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const hadController = Boolean(navigator.serviceWorker.controller);
      let refreshing = false;

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadController && !refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      navigator.serviceWorker
        .register('./sw.js', { updateViaCache: 'none' })
        .then((reg) => {
          const activateWaiting = (worker) => {
            if (worker && worker.state === 'installed' && navigator.serviceWorker.controller) {
              worker.postMessage({ type: 'SKIP_WAITING' });
            }
          };

          if (reg.waiting) {
            activateWaiting(reg.waiting);
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => activateWaiting(newWorker));
          });

          reg.update().catch(() => {});
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              reg.update().catch(() => {});
            }
          });
        })
        .catch(() => {});
    });
  }
}

let mountedGallery = false;
if (import.meta.env.DEV) {
  const devParams = new URLSearchParams(window.location.search);
  if (devParams.get('gallery') === '1') {
    mountedGallery = true;
    import('./three/dev/VisualGallery3D.ts').then((m) => m.mountVisualGallery());
  }
}

if (!mountedGallery) {
  bootGame();
  if (import.meta.env.DEV) {
    const devParams = new URLSearchParams(window.location.search);
    if (devParams.get('perf') === '1') {
      import('./three/dev/PerfOverlay.ts').then((m) => m.mountPerfOverlay());
    }
  }
}
