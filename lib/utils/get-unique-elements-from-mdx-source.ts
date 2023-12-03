// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const P1 = /(_jsxs|_jsx)\(_components.[a-zA-Z-_0-9]+/g;
const P2 = /(_jsxs|_jsx)\("[a-zA-Z-_0-9]+"/g;
const P3 = /(_jsxs|_jsx)\([a-zA-Z-_0-9]+/g;
export const JSX_ELEMENTS_PATTERN = new RegExp(`${P1.source}|${P2.source}|${P3.source}`, 'g');

// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------

const getUniqueElementsFromMDXSource = (mdxSource: string): string[] => {
  const elements = mdxSource.match(JSX_ELEMENTS_PATTERN) ?? [];

  return [
    ...new Set(
      [...new Set(elements)].map((e) => {
        let e_ = e;
        // Remove `_jsxs(` and `_jsx(` from the beginning of the string.
        if (e.startsWith('_jsxs(')) e_ = e.substring(6);
        else if (e.startsWith('_jsx(')) e_ = e.substring(5);

        // Remove `"` from the beginning and end of the string or remove
        // `_components.` from the beginning of the string.
        if (e_.startsWith('"') && e_.endsWith('"')) e_ = e_.substring(1, e_.length - 1);
        else if (e_.startsWith('_components.')) e_ = e_.substring(12);

        return e_;
      }),
    ),
  ];
};

export default getUniqueElementsFromMDXSource;
