import { WebR } from 'webr';

export const getWebR = async () => {
  const r = new WebR({ baseUrl: 'https://webr.r-wasm.org/v0.4.3/' });
  await r.init();
  await r.installPackages(['PBSddesolve', 'escape2024', 'jsonlite', 'dplyr'], {
    repos: ['https://jgf5013.r-universe.dev', 'https://r-forge.r-universe.dev', 'https://karlines.r-universe.dev', 'https://repo.r-wasm.org'],
    quiet: false,
  });
  return r;
};