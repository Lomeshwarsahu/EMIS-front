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

async function hideSplash(): Promise<void> {
  await splashVideoComplete;
  const splash = document.getElementById('app-splash');
  if (!splash) return;
  // Keep this cookie because login/logout clear localStorage.
  document.cookie = 'splashShown=1; max-age=31536000; path=/; SameSite=Lax';
  splash.remove();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(hideSplash)
  .catch(hideSplash);
