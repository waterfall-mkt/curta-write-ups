import { expect, test } from 'vitest';

import { ELEMENTS } from '@/lib/constants/elements';
import { readFile, serializeToMDXSource } from '@/lib/utils';

// -----------------------------------------------------------------------------
// Set up
// -----------------------------------------------------------------------------

const source = await readFile('./puzzles/eth/4.mdx');
const mdxSource = await serializeToMDXSource(source);
const frontmatter = mdxSource.frontmatter;

const p1 = /(_jsxs|_jsx)\(_components.[a-zA-Z-_0-9]+/g;
const p2 = /(_jsxs|_jsx)\("[a-zA-Z-_0-9]+"/g;
const p3 = /(_jsxs|_jsx)\([a-zA-Z-_0-9]+/g;
const pattern = new RegExp(`${p1.source}|${p2.source}|${p3.source}`, 'g');
const elements = mdxSource.compiledSource.match(pattern) ?? [];
const uniqueElements = [
  ...new Set(
    [...new Set(elements)].map((e) => {
      let e_ = e;
      if (e.startsWith('_jsxs(')) e_ = e.substring(6);
      else if (e.startsWith('_jsx(')) e_ = e.substring(5);
      if (e_.startsWith('"') && e_.endsWith('"')) e_ = e_.substring(1, e_.length - 1);
      else if (e_.startsWith('_components.')) e_ = e_.substring(12);

      return e_;
    }),
  ),
];

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

test('Verifies `frontmatter` header exists', () => {
  expect(frontmatter).toBeDefined();
  expect(frontmatter.author).toBeDefined();
  expect(frontmatter.contributors).toBeDefined();
});
test('Verifies `frontmatter.author` is an address', () => {
  expect(frontmatter.author).toMatch(/^0x[0-9a-fA-F]{40}$/);
});
test('Verifies `frontmatter.contributors` is an array of addresses', () => {
  expect(frontmatter.contributors).toBeInstanceOf(Array);
  expect(frontmatter.contributors.length).greaterThan(0);
  frontmatter.contributors.forEach((contributor) => {
    expect(contributor).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });
});
test('Verifies `frontmatter.contributors` to include the primary author', () => {
  expect(frontmatter.contributors).toContain(frontmatter.author);
});
test('Verifies content does not contain any prohibited substrings.', () => {
  const matches = source.match(pattern);
  expect(matches === null || matches.length === 0).toBe(true);
});
test('Verifies content does not contain any invalid JSX elements.', () => {
  uniqueElements.forEach((element) => {
    expect(ELEMENTS).toContain(element);
  });
});
