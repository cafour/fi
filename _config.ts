import lume from "lume/mod.ts";
import markdown from "lume/plugins/markdown.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import sass from "lume/plugins/sass.ts";
import postcss from "lume/plugins/postcss.ts";
import transformImages from "lume/plugins/transform_images.ts";
import picture from "lume/plugins/picture.ts";
import katex from "./_plugins/katex.ts";
import metas from "lume/plugins/metas.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import codeHighlight from "./_plugins/shiki.ts";
import sitemap from "lume/plugins/sitemap.ts";
import inline from "lume/plugins/inline.ts";
import pagefind from "lume/plugins/pagefind.ts";
import { linkInsideHeader } from "lume_markdown_plugins/toc/anchors.ts";
import toc from "lume_markdown_plugins/toc.ts";
import esbuild from "lume/plugins/esbuild.ts";

import { AsciidoctorEngine, asciidocLoader } from "./_plugins/asciidoc.ts";
import { default as markdownItAlerts } from "npm:markdown-it-github-alerts";
import modules from "lume/plugins/modules.ts";
import finder from "./_plugins/finder.ts";

const site = lume({
    dest: "public/",
    location: new URL("https://fi.cafour.cz"),
});

site
    .ignore("readme.md", "contributing.md", "public", "deps.ts", "_plugins")
    .use(markdown({
        plugins: [[markdownItAlerts, {
            titles: {
                "tip": "",
                "note": "",
                "important": "",
                "warning": "",
                "caution": ""
            },
            icons: {
                "tip": " ",
                "note": " ",
                "important": " ",
                "warning": " ",
                "caution": " "
            },
            classPrefix: "alert"
        }]]
    }))
    .use(toc({
        tabIndex: false,
        // anchor: false,
        anchor: linkInsideHeader({
            placement: "before"
        })
    }))
    .use(jsx())
    .use(sass())
    .use(postcss())
    .use(metas())
    .use(resolveUrls())
    .use(sitemap({
        query: "indexable=true"
    }))
    .use(inline())
    .use(picture())
    .use(transformImages({
        extensions: [".png", ".jpg", ".jpeg", ".gif"],
        functions: {
            async resizeCrop(img, size) {
                const metadata = await img.metadata();
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

                if (metadata.width! < metadata.height!) {
                    img.resize(width, null);
                } else {
                    img.resize(null, height);
                }

                img.extract({
                    width: width,
                    height: height,
                    left: Math.floor((metadata.width! - width) / 2),
                    top: Math.floor((metadata.height! - height) / 2)
                });
            }
        }
    }))
    .use(katex({
        options: {
            fleqn: true,
            throwOnError: false,
            output: "html",
            strict: false
        }
    }))
    .use(await codeHighlight())
    .use(esbuild({
        options: {
            bundle: true,
            format: "iife",
            minify: false,
            platform: "browser",
            target: "esnext",
            entryPoints: ["./scripts/main.ts"],
            globalName: "fi"
        }
    }))
    .loadPages([".ad"], { loader: asciidocLoader, engine: new AsciidoctorEngine() })
    .copy([".svg"])
    .copy("fonts")
    .copy("icons")
    .use(finder())
    .use(pagefind({
        indexing: {
            rootSelector: "main"
        },
        ui: {
            showSubResults: true
        }
    }));

export default site;
