/// <reference types="vite/client" />

declare global {
  var global: typeof globalThis;
  var process: {
    env: Record<string, string>;
    browser: boolean;
  };
}

export {};