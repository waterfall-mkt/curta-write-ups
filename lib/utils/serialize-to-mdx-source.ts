import { serialize } from 'next-mdx-remote/serialize';
import rehypeKatex from 'rehype-katex';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const serializeToMDXSource = async (source: string) => {
  return await serialize<
    Record<string, unknown>,
    {
      author: `0x${string}`;
      contributors: `0x${string}`[];
      adapted_from?: string;
    }
  >(source, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex, rehypeMdxCodeProps],
    },
  });
};

export default serializeToMDXSource;
