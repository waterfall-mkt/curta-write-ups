import { glob } from 'glob';
import { expect, test } from 'vitest';

import { ELEMENTS } from '@/lib/constants/elements';
import { getUniqueElementsFromMDXSource, readFile, serializeToMDXSource } from '@/lib/utils';
import { JSX_ELEMENTS_PATTERN } from '@/lib/utils/get-unique-elements-from-mdx-source';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

// Fetch all MDX files in `./puzzles/*`.
const files = await glob('./puzzles/**/*.mdx', { ignore: 'node_modules/**' });

// Loop through the list of MDX files found in `./puzzles/*`, and verify each
// file's contents.
files.map(async (file) => {
  const paths = file.split('/');
  const chain = paths[paths.length - 2];
  const id = paths[paths.length - 1];
  const identifier = `${chain}/${id}`.replace('.mdx', '');

  const source = await readFile(file);
  const mdxSource = await serializeToMDXSource(source);
  const frontmatter = mdxSource.frontmatter;
  const uniqueElements = getUniqueElementsFromMDXSource(mdxSource.compiledSource);

  // ---------------------------------------------------------------------------
  // Verify `frontmatter` content
  // ---------------------------------------------------------------------------

  test(`[${identifier}]: Verifies \`frontmatter\` header exists`, () => {
    expect(frontmatter).toBeDefined();
    expect(frontmatter.author).toBeDefined();
    expect(frontmatter.contributors).toBeDefined();
  });
  test(`[${identifier}]: Verifies \`frontmatter.author\` is an address`, () => {
    expect(frontmatter.author).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });
  test(`[${identifier}]: Verifies \`frontmatter.contributors\` is an array of addresses`, () => {
    expect(frontmatter.contributors).toBeInstanceOf(Array);
    expect(frontmatter.contributors.length).greaterThan(0);
    frontmatter.contributors.forEach((contributor) => {
      expect(contributor).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });
  });
  test(`[${identifier}]: Verifies \`frontmatter.contributors\` to include the primary author`, () => {
    expect(frontmatter.contributors).toContain(frontmatter.author);
  });

  // ---------------------------------------------------------------------------
  // Verify MDX content
  // ---------------------------------------------------------------------------

  test(`[${identifier}]: Verifies content does not contain any prohibited substrings.`, () => {
    const matches = source.match(JSX_ELEMENTS_PATTERN);
    expect(matches === null || matches.length === 0).toBe(true);
  });
  test(`[${identifier}]: Verifies content does not contain any invalid JSX elements.`, () => {
    uniqueElements.forEach((element) => {
      expect(ELEMENTS).toContain(element);
    });
  });
});
