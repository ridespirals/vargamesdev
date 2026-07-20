import StartGame from './game/main';
import { mountDevToolbar } from './dev/DevToolbar';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app && import.meta.env.DEV) {
    mountDevToolbar(app);
  }
  StartGame('game-container');
});
