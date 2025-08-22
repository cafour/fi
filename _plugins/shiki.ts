import {
    createHighlighter,
    BundledHighlighterOptions,
    BundledLanguage,
    BundledTheme,
    Highlighter
} from "npm:shiki@3.9.1";
import { Node } from "lume/deps/dom.ts";
import Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";


export interface Options {
    extensions: string[];
    options: BundledHighlighterOptions<BundledLanguage, BundledTheme>;
    cssSelector: string;
    languageDetectRe: RegExp;
}

// Default options
export const defaults: Options = {
    extensions: [".html"],
    cssSelector: "pre code",
    languageDetectRe: /\blanguage-([\w-]+)\b/i,
    options: {
        langs: ["csharp", "c#", "js", "ts", "html", "css", "json", "xml", "yaml", "markdown", "bash", "powershell", "haskell", "prolog", "java", "matlab", "glsl", "sql", "python", "cpp", "c++", ],
        themes: ["dark-plus"]
    }
};

let promise: Promise<Highlighter> | null = null;

async function highlightCode(options: Options, page: Lume.Page) {
    const nodes = page.document!.querySelectorAll(options.cssSelector);
    for (const node of nodes) {
        if (node.nodeType != Node.ELEMENT_NODE) {
            continue;
        }

        let element = node as unknown as HTMLElement;

        let lang = "plain";
        element.classList.forEach(c => {
            const result = options.languageDetectRe.exec(c);
            if (result && result.length > 0) {
                lang = result[1];
            }
        });
        if (lang === "plain") {
            continue;
        }

        try {
            if (element.parentElement?.tagName === "PRE") {
                element = element.parentElement;
            }

            promise ??= createHighlighter(options.options);
            const highlighter = await promise;
            const highlightedCode = highlighter.codeToHtml(element.innerText, { lang, theme: "dark-plus" });
            const wrapper = element.ownerDocument.createElement("div");
            wrapper.innerHTML = highlightedCode;
            const highlightedElement = wrapper.firstElementChild!;
            highlightedElement.classList.add("snippet", `language-${lang}`)
            highlightedElement.classList.add(...element.classList);
            element.outerHTML = highlightedElement.outerHTML;
        } catch (e) {
            console.log(`${page.sourcePath}: ${e}`);
        }
    }
}

export default function shiki(userOptions?: Options): Lume.Plugin {
    const options = merge(defaults, userOptions);

    return (site: Site) => {
        site.process(options.extensions, async pages => {
            await Promise.all(pages.map(p => highlightCode(options, p)));
        });
    };
}
