import { getDevSettings, setDevSetting, subscribeDevSettings, type DevSettings } from './settings';

const TOGGLES: { key: keyof DevSettings; label: string; title: string }[] = [
  {
    key: 'clipping',
    label: 'Clipping',
    title: 'Scroll only — no player gravity or collision',
  },
  {
    key: 'flatland',
    label: 'Flatland',
    title: 'No gaps or obstacles',
  },
  {
    key: 'forever',
    label: 'Forever',
    title: 'Skip Game Over and auto-restart',
  },
];

/** DOM toolbar that stays visible across Phaser scenes. */
export function mountDevToolbar(parent: HTMLElement): void {
  if (document.getElementById('dev-toolbar')) {
    return;
  }

  const bar = document.createElement('div');
  bar.id = 'dev-toolbar';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Dev tools');

  const title = document.createElement('div');
  title.className = 'dev-toolbar-title';
  title.textContent = 'Dev';
  bar.appendChild(title);

  const inputs = new Map<keyof DevSettings, HTMLInputElement>();

  for (const toggle of TOGGLES) {
    const label = document.createElement('label');
    label.className = 'dev-toolbar-toggle';
    label.title = toggle.title;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = getDevSettings()[toggle.key];
    input.addEventListener('change', () => {
      setDevSetting(toggle.key, input.checked);
    });

    const span = document.createElement('span');
    span.textContent = toggle.label;

    label.appendChild(input);
    label.appendChild(span);
    bar.appendChild(label);
    inputs.set(toggle.key, input);
  }

  parent.appendChild(bar);

  subscribeDevSettings((settings) => {
    for (const [key, input] of inputs) {
      input.checked = settings[key];
    }
  });
}
