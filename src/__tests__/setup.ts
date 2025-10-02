import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const matchers = require('@testing-library/jest-dom/matchers');
  // @ts-ignore
  expect.extend(matchers);
} catch {}

afterEach(() => {
  cleanup();
});