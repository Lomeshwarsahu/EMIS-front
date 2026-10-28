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

// Prepare the login page while the first-visit splash video plays.
// Remove the splash as soon as both the video and Angular are ready.
function waitForSplashVideo(): Promise<void> {
  const video = document.querySelector<HTMLVideoElement>('#app-splash .splash-video');
  if (document.documentElement.classList.contains('splash-seen') || !video ||
      video.ended || video.error || video.dataset['splashComplete'] === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    // Skip unavailable or stalled playback instead of leaving the user waiting.
    let timer: ReturnType<typeof setTimeout>;
    const done = () => {
      clearTimeout(timer);
      video.removeEventListener('ended', done);
      video.removeEventListener('error', done);
      video.removeEventListener('splashcomplete', done);
      video.removeEventListener('timeupdate', resetTimeout);
      resolve();
    };
    const resetTimeout = () => {
      clearTimeout(timer);
      timer = setTimeout(done, 3000);
    };
    video.addEventListener('ended', done);
    video.addEventListener('error', done);
    video.addEventListener('splashcomplete', done);
    video.addEventListener('timeupdate', resetTimeout);
    resetTimeout();
  });
}

const splashVideoComplete = waitForSplashVideo();

const FLY_MS = 650;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Login header logos: [left = govt, right = CGMSC]. Polls briefly because the login view renders after bootstrap.
async function findHeaderLogos(): Promise<HTMLElement[] | null> {
  for (let t = 0; t < 800; t += 50) {
    const left = document.querySelector<HTMLElement>('.gov-header .gov-logo:not(.gov-logo--wide)');
    const right = document.querySelector<HTMLElement>('.gov-header .gov-logo--wide');
    if (left && right && left.getBoundingClientRect().width && right.getBoundingClientRect().width) return [left, right];
    await wait(50);
  }
  return null;
}

// Zoom each splash logo into the exact spot of its login-header twin (transform-origin is 0 0 in index.html).
function flyTo(logo: HTMLElement, target: HTMLElement): void {
  const from = logo.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const scale = to.height / from.height;
  logo.style.transition = `transform ${FLY_MS}ms cubic-bezier(.65, 0, .35, 1)`;
  logo.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})`;
}

async function hideSplash(): Promise<void> {
  await splashVideoComplete;
  const splash = document.getElementById('app-splash');
  if (!splash) return;
  // Keep this cookie because login/logout clear localStorage.
  document.cookie = 'splashShown=1; max-age=31536000; path=/; SameSite=Lax';

  const targets = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? null : await findHeaderLogos();
  const bg = splash.querySelector<HTMLElement>('.splash-bg');
  const blur = splash.querySelector<HTMLElement>('.splash-blur');
  if (bg) { bg.style.transition = `opacity ${FLY_MS}ms ease`; bg.style.opacity = '0'; }
  if (blur) { blur.style.backdropFilter = 'blur(0)'; blur.style.setProperty('-webkit-backdrop-filter', 'blur(0)'); }

  if (targets) {
    splash.querySelectorAll<HTMLElement>('.splash-divider, .splash-text, .splash-flag')
      .forEach((el) => (el.style.opacity = '0'));
    // Hide the real header logos until the flying copies land on them.
    targets.forEach((t) => (t.style.visibility = 'hidden'));
    splash.querySelectorAll<HTMLElement>('.splash-logo').forEach((logo) => {
      flyTo(logo, targets[logo.dataset['target'] === 'right' ? 1 : 0]);
    });
    await wait(FLY_MS);
    targets.forEach((t) => (t.style.visibility = ''));
  } else {
    // Other routes / reduced motion: plain fade.
    splash.style.transition = 'opacity .4s ease';
    splash.style.opacity = '0';
    await wait(400);
  }
  splash.remove();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(hideSplash)
  .catch(hideSplash);
