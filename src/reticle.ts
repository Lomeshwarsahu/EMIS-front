import { environment } from './environments/environment';

type ReticleCore = {
  reticle: { signal: (name: string, data?: Record<string, unknown>) => void };
};

export function signal(name: string, data?: Record<string, unknown>): void {
  if (environment.production) {
    return;
  }

  void import('@reticlehq/core').then((core) => {
    const { reticle } = core as unknown as ReticleCore;
    reticle.signal(name, data);
  });
}
