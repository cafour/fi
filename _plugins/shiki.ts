import { HighlighterOptions, getHighlighter } from "npm:shiki";
import { Node } from "lume/deps/dom.ts";
import Site from "lume/core/site.ts";
import { Page } from "lume/core/file.ts";


export interface Options {
    extensions: string[];
    options: HighlighterOptions;
    cssSelector: string;
    languageDetectRe: RegExp;
}

// Default options
export const defaults: Options = {
    extensions: [".html"],
    cssSelector: "pre code",
    languageDetectRe: /\blanguage-([\w-]+)\b/i,
    options: {
        langs: ["csharp", "js", "ts", "html", "css", "json", "xml", "yaml", "markdown", "bash", "powershell", "haskell", "prolog", "java", "matlab"],
        theme: "dark-plus"
    }
};

/** A plugin to syntax-highlight code using the highlight.js library */
export default async function (userOptions?: Options) {
    const options = { ...defaults, ...userOptions };
    const highlighter = await getHighlighter(options.options);

    return (site: Site) => {
        site.process(options.extensions, pages => {
            pages.forEach(codeHighlight);
        });

        function codeHighlight(page: Page) {
            page.document!.querySelectorAll(options.cssSelector)
                .forEach((node) => {
                    if (node.nodeType != Node.ELEMENT_NODE) {
                        return;
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
                        return;
                    }

                    try {
                        if (element.parentElement?.tagName === "PRE") {
                            element = element.parentElement;
                        }

                        const highlightedCode = highlighter.codeToHtml(element.innerText, { lang });
                        const wrapper = element.ownerDocument.createElement("div");
                        wrapper.innerHTML = highlightedCode;
                        const highlightedElement = wrapper.firstElementChild!;
                        highlightedElement.classList.add("snippet", `language-${lang}`)
                        highlightedElement.classList.add(...element.classList);
                        element.outerHTML = highlightedElement.outerHTML;
                    } catch (e) {
                        console.log(`${page.sourcePath}: ${e}`);
                    }
                });
        }
    };
}
