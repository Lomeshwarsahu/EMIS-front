import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Globally suppress all console output across the entire application
const noop = () => {};
console.log = noop;
console.info = noop;
console.warn = noop;
console.error = noop;
console.debug = noop;
console.table = noop;
console.dir = noop;
console.trace = noop;
if (typeof window !== 'undefined' && window.console) {
  window.console.log = noop;
  window.console.info = noop;
  window.console.warn = noop;
  window.console.error = noop;
  window.console.debug = noop;
  window.console.table = noop;
  window.console.dir = noop;
  window.console.trace = noop;
}

// Splash screen (index.html): logos open big, then zoom out and fly into their
// places in the login header while the background blurs away.
// Shown only on the very first visit; index.html hides it on later loads.
const firstLoad = !document.documentElement.classList.contains('splash-seen');
const INTRO_MS = 4000; // lets the background video play before the hand-off
const FLY_MS = 950;
const splashStart = Date.now();
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Waits (max `timeoutMs`) for the login header logos to be laid out. */
async function findHeaderLogos(timeoutMs: number): Promise<HTMLElement[] | null> {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    const logos = Array.from(document.querySelectorAll<HTMLElement>('.gov-header .gov-logo'));
    if (logos.length >= 2 && logos.every((el) => el.getBoundingClientRect().height > 0)) return logos;
    await wait(50);
  }
  return null;
}

/** Moves `el` (no transform applied) onto `target`'s rendered image box. */
function flyTo(el: HTMLElement, target: HTMLElement): void {
  const from = el.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const img = target as HTMLImageElement;
  // object-fit: contain — use the actually drawn image size inside the target box
  const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : to.width / to.height;
  const drawnW = Math.min(to.width, to.height * ratio);
  const drawnH = drawnW / ratio;
  const scale = drawnW / from.width;
  // transform-origin is top-left, so move the top-left corner onto the drawn image's top-left
  const dx = to.left + (to.width - drawnW) / 2 - from.left;
  const dy = to.top + (to.height - drawnH) / 2 - from.top;
  el.style.transformOrigin = '0 0';
  el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
}

async function hideSplash(): Promise<void> {
  const splash = document.getElementById('app-splash');
  if (!splash) return;
  try {
    localStorage.setItem('splashShown', '1');
  } catch {
    // storage blocked: splash will simply play again next time
  }
  const done = () => splash.remove();

  if (!firstLoad) {
    done();
    return;
  }

  await wait(Math.max(0, INTRO_MS - (Date.now() - splashStart)));
  const targets = await findHeaderLogos(1500);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!targets || reduceMotion) {
    // Not on the login page (or reduced motion): plain fade out.
    splash.classList.add('splash-hide');
    await wait(400);
    done();
    return;
  }

  const [leftTarget, rightTarget] = targets;
  const logos = Array.from(splash.querySelectorAll<HTMLElement>('.splash-logo'));
  targets.forEach((t) => (t.style.visibility = 'hidden'));
  splash.querySelector('.splash-logos')?.classList.remove('intro');
  void splash.offsetWidth; // apply the no-animation state before measuring
  splash.classList.add('flying');
  logos.forEach((el) => flyTo(el, el.dataset['target'] === 'left' ? leftTarget : rightTarget));

  await wait(FLY_MS + 50);
  targets.forEach((t) => (t.style.visibility = ''));
  done();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(hideSplash)
  .catch(hideSplash);