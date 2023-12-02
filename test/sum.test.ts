// sum.test.js
import { expect, test } from 'vitest';

import { sum } from '@/lib/utils/sum';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
