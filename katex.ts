import Site from "lume/core/site.ts";
import katex from "lume/plugins/katex.ts";
import { Options } from "lume/plugins/katex.ts";

const BASE = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/";

const FILES =
    [
        "katex.css",
        "fonts/KaTeX_AMS-Regular.woff2",
        "fonts/KaTeX_Caligraphic-Bold.woff2",
        "fonts/KaTeX_Caligraphic-Regular.woff2",
        "fonts/KaTeX_Fraktur-Bold.woff2",
        "fonts/KaTeX_Fraktur-Regular.woff2",
        "fonts/KaTeX_Main-Bold.woff2",
        "fonts/KaTeX_Main-BoldItalic.woff2",
        "fonts/KaTeX_Main-Italic.woff2",
        "fonts/KaTeX_Main-Regular.woff2",
        "fonts/KaTeX_Math-BoldItalic.woff2",
        "fonts/KaTeX_Math-Italic.woff2",
        "fonts/KaTeX_SansSerif-Bold.woff2",
        "fonts/KaTeX_SansSerif-Italic.woff2",
        "fonts/KaTeX_SansSerif-Regular.woff2",
        "fonts/KaTeX_Script-Regular.woff2",
        "fonts/KaTeX_Size1-Regular.woff2",
        "fonts/KaTeX_Size2-Regular.woff2",
        "fonts/KaTeX_Size3-Regular.woff2",
        "fonts/KaTeX_Size4-Regular.woff2",
        "fonts/KaTeX_Typewriter-Regular.woff2"
    ];

export default function (options?: Options) {
    return (site: Site) => {
        site.use(katex(options));
        for (const file of FILES) {
            site.remoteFile(file, BASE + file);
            site.copy(file);
        }
    };
}
