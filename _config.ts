import lume from "lume/mod.ts";
import remark from "lume/plugins/remark.ts";
import remarkAlert from "./_plugins/remark-alerts.ts";
import { remarkDefinitionList, defListHastHandlers } from "npm:remark-definition-list";
import remarkTextr from "npm:remark-textr";
import remarkTitle from "./_plugins/remark-title.ts";
import rehypeSlug from "npm:rehype-slug";
import rehypeAutolinkHeadings from "npm:rehype-autolink-headings";
import jsx from "lume/plugins/jsx.ts";
import sass from "lume/plugins/sass.ts";
import postcss from "lume/plugins/postcss.ts";
import transformImages from "lume/plugins/transform_images.ts";
import picture from "lume/plugins/picture.ts";
import katex from "./_plugins/katex.ts";
import metas from "lume/plugins/metas.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import shiki from "./_plugins/shiki.ts";
import sitemap from "lume/plugins/sitemap.ts";
import inline from "lume/plugins/inline.ts";
import pagefind from "lume/plugins/pagefind.ts";
import esbuild from "lume/plugins/esbuild.ts";
import typographicBase from "npm:typographic-base";
import tailwindcss from "lume/plugins/tailwindcss.ts";

import { AsciidoctorEngine, asciidocLoader } from "./_plugins/asciidoc.ts";
import finder from "./_plugins/finder.ts";
import git from "./_plugins/git.ts";

const site = lume({
    dest: "public/",
    location: new URL("https://fi.cafour.cz"),
});

site.ignore("readme.md", "contributing.md", "public", "deps.ts", "_plugins");
site.use(remark({
    remarkPlugins: [
        [
            remarkAlert,
            {
                classPrefix: "alert",
                icons: {
                    "TIP": "",
                    "NOTE": "",
                    "WARNING": ""
                },
                titles: {
                    "TIP": "Tip",
                    "NOTE": "Poznámka",
                    "WARNING": "Varování",
                    "IMPORTANT": "Důležitost",
                    "CAUTION": "Bacha!"
                }
            }
        ],
        [remarkDefinitionList],
        [
            remarkTextr,
            {
                options: {
                    locale: "cs"
                },
                plugins: [
                    typographicBase
                ]
            }
        ],
        [remarkTitle]
    ],
    rehypePlugins: [
        [rehypeSlug],
        [
            rehypeAutolinkHeadings,
            {
                content: {
                    type: "text",
                    value: "#"
                },
                properties: {
                    tabIndex: -1,
                    class: "header-anchor"
                }
            }
        ]
    ],
    rehypeOptions: {
        handlers: {
            ...defListHastHandlers
        }
    }
}));
site.use(jsx());
site.use(esbuild({
    options: {
        bundle: true,
        format: "iife",
        minify: false,
        platform: "browser",
        target: "esnext",
        entryPoints: ["./scripts/main.ts"],
        globalName: "fi"
    }
}));
site.use(sass());
site.use(tailwindcss());
site.use(postcss());
site.use(metas());
site.use(resolveUrls());
site.use(sitemap({
    query: "indexable=true"
}));
site.use(picture());
site.use(transformImages({
    functions: {
        resizeCrop(img, size) {
            let width = -1;
            let height = -1;

            if (typeof (size) == "number") {
                width = size;
                height = size;
            }
            else {
                width = size[0];
                height = size[1];
            }

            img.resize({
                width: width,
                height: height,
                fit: "cover",
                position: "centre"
            });
        }
    }
}));
site.use(inline());
site.use(katex({
    options: {
        fleqn: true,
        throwOnError: false,
        output: "html",
        strict: false,
        delimiters: [
            { left: "$", right: "$", display: false },
            { left: "$$", right: "$$", display: true },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\begin{equation}", right: "\\end{equation}", display: true },
            { left: "\\begin{align}", right: "\\end{align}", display: true },
            { left: "\\begin{alignat}", right: "\\end{alignat}", display: true },
            { left: "\\begin{gather}", right: "\\end{gather}", display: true },
            { left: "\\begin{CD}", right: "\\end{CD}", display: true },
            { left: "\\[", right: "\\]", display: true }
        ]
    }
}));
site.use(shiki())
site.loadPages([".ad"], { loader: asciidocLoader, engine: new AsciidoctorEngine() })
site.copy("fonts");
site.add("icons");
site.add("index.md");
site.add("scripts");
site.add("styles");
site.add([".md", ".ad"]);
site.add([".png", ".jpg", ".jpeg", ".gif", ".svg"])
site.use(finder());
site.use(git());
site.use(pagefind({
    indexing: {
        rootSelector: "main"
    },
    ui: {
        showSubResults: true
    }
}));

export default site;
