import lume from "lume/mod.ts";
import markdown from "lume/plugins/markdown.ts";
import jsx from "lume/plugins/jsx.ts";
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
import finder from "./_plugins/finder.ts";

const site = lume({
    dest: "public/",
    location: new URL("https://fi.cafour.cz"),
});

site.ignore("readme.md", "contributing.md", "public", "deps.ts", "_plugins");
site.use(markdown({
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
}));
site.use(toc({
    tabIndex: false,
    // anchor: false,
    anchor: linkInsideHeader({
        placement: "before"
    })
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
        strict: false
    }
}));
// .use(await codeHighlight())
site.loadPages([".ad"], { loader: asciidocLoader, engine: new AsciidoctorEngine() })
site.copy("fonts");
site.add("icons");
site.add("index.md");
site.add("scripts");
site.add("styles");
site.add([".md", ".ad"]);
site.add([".png", ".jpg", ".jpeg", ".gif", ".svg"])
site.use(finder());
site.use(pagefind({
    indexing: {
        rootSelector: "main"
    },
    ui: {
        showSubResults: true
    }
}));

export default site;
