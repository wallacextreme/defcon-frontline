import './styles/tactical.css';
import { Battlefield3D } from './three/Battlefield3D.ts';
import { HudController } from './ui/HudController.js';

new HudController();

const container = document.getElementById('game-container');
window.__DEFCON_GAME__ = new Battlefield3D(container);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
