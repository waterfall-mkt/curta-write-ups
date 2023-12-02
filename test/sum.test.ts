import { expect, test } from 'vitest';

import { readFile } from '@/lib/utils';

test('adds 1 + 2 to equal 3', async () => {
  const source = await readFile('./puzzles/eth/1.mdx');
});
