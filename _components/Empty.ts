import { preact } from "lume/deps/preact.ts";
import parse from "npm:html-react-parser";

export default function Empty({ html }: { html: string }) {
    // deno-lint-ignore no-explicit-any
    return (parse as any)(html, {
        library: preact
    });
    // return preact.h(preact.Fragment, { dangerouslySetInnerHTML: { __html: html } } as any);
    // return React.createElement(React.Fragment, { dangerouslySetInnerHTML: { __html: html } } as any);
}
