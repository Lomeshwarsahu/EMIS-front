const RETICLE_TESTIDS = [
  'menu-search-input',
  'mobile-menu-btn',
  'sidebar-collapse-btn',
  'header-page-title',
  'filter-financial-year',
  'filter-tender',
  'filter-sd-status',
  'clear-filter-btn',
] as const;

type ReticleCore = {
  reticle: { connect: (options?: { projectId?: string }) => void };
  registerCapabilities: (input: {
    testids: string[];
    signals: string[];
    stores: string[];
  }) => void;
};

export function initReticle(): void {
  void import('@reticlehq/core').then((core) => {
    const { reticle, registerCapabilities } = core as unknown as ReticleCore;
    reticle.connect({ projectId: 'emis-df1e825e' });
    registerCapabilities({
      testids: [...RETICLE_TESTIDS],
      signals: [],
      stores: [],
    });
  });
}
