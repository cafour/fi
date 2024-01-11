import { Data } from "lume/core/file.ts";
import { Asciidoctor, asciidoctor, kroki } from "./deps.ts";
import { Engine } from "lume/core/renderer.ts";
import * as path from "std/path/mod.ts";

const ad = Asciidoctor();

interface CustomConverterOptions {
    base: string;
}

const DEFAULT_CUSTOM_CONVERTER_OPTIONS: CustomConverterOptions = {
    base: ""
};

function tryUrl(value: string) {
    try {
        return new URL(value);
    } catch {
        return null;
    }
}

class CustomConverter implements asciidoctor.AbstractConverter {
    baseConverter = ad.Html5Converter.create();
    options: CustomConverterOptions = { ...DEFAULT_CUSTOM_CONVERTER_OPTIONS };

    constructor(_backend?: string, opts?: (any | { links?: CustomConverterOptions })) {
        if (opts) {
            // TODO: wtf is this so convoluted
            const base = opts?.document?.attributes?.$$smap?.base ?? "";
            this.options = { ...this.options, base: base };
        }
    }

    convert(node: asciidoctor.AbstractNode, transform?: string | undefined, opts?: unknown): string {
        const nodeName = transform ?? node.getNodeName();
        if (nodeName === "inline_anchor") {
            const target = (node as asciidoctor.AbstractBlock & { target: string }).target.toString();
            const targetUrl = tryUrl(target);
            if (targetUrl) {
                node.setAttribute("window", "_blank");
            }
        }
        if (nodeName === "image" || nodeName === "inline_image") {
            const target = node.getAttribute("target")
            if (URL.canParse(target)) {
                const targetUrl = new URL(target);
                if (targetUrl.hostname === "kroki.io") {
                    // return `<div class="imageblock kroki"><div class="content"><img src="${targetUrl}" inline /></div></div>`;
                }
            }
        } else if (nodeName === "thematic_break") {
            return `<div class="asterism">&#x2042;</div>`;
        }

        return this.baseConverter.convert(node, transform, opts);
    }
}
ad.ConverterFactory.register(CustomConverter, ["html5"]);

interface AsciidocData extends Data {
    styles?: string[];
    doc?: asciidoctor.Document;
    order?: string;
    group?: string;
    year?: string;
    link?: string;
    image?: string;
    showtitle?: boolean;
}

export async function asciidocLoader(filePath: string): Promise<Partial<AsciidocData>> {
    const reg = ad.Extensions.create();
    kroki.register(reg);
    reg.includeProcessor(function () {
        this.handles(t => { return true; });
        this.process((doc, reader, target, attrs) => {
            const content = Deno.readTextFileSync(path.join(doc.getBaseDir(), target));
            return reader.pushInclude(content, target, target, 1, attrs);
        });
    });

    const text = await Deno.readTextFile(filePath);
    const doc = ad.load(text, {
        base_dir: path.dirname(filePath),
        standalone: false,
        backend: "html5",
        safe: "unsafe",
        attributes: {
            stem: "tex",
            "allow-uri-read": "true",
            "table-caption": "Tabulka",
            "figure-caption": "Obrázek",
            "listing-caption": "Kód",
            "example-caption": "Příklad"
        },
        extension_registry: reg
    });
    doc.setOption("allow-uri-read");
    const data: Partial<AsciidocData> = {
        doc: doc,
        content: doc.getSource(),
        title: doc.getTitle()
    };

    if (doc.getAttribute("tags")) {
        data.tags = (doc.getAttribute("tags") as string).split(",").map(s => s.trim());
    }

    if (doc.getAttribute("url")) {
        data.url = doc.getAttribute("url");
    }

    if (doc.getAttribute("draft")) {
        data.draft = doc.getAttribute("draft");
    }

    if (doc.getAttribute("page-date")) {
        data.date = doc.getAttribute("page-date");
    }

    if (doc.getAttribute("date")) {
        data.date = doc.getAttribute("date");
    }

    if (doc.getAttribute("render-order")) {
        data.renderOrder = doc.getAttribute("render-order");
    }

    if (doc.getAttribute("layout")) {
        data.layout = doc.getAttribute("layout");
    }

    if (doc.getAttribute("styles")) {
        data.styles = (doc.getAttribute("styles") as string).split(",").map(s => s.trim());
    }

    if (doc.getAttribute("page-order")) {
        data.order = doc.getAttribute("page-order");
    }

    if (doc.getAttribute("order")) {
        data.order = doc.getAttribute("order");
    }

    if (doc.getAttribute("page-group")) {
        data.group = doc.getAttribute("page-group");
    }

    if (doc.getAttribute("group")) {
        data.group = doc.getAttribute("group");
    }

    if (doc.getAttribute("page-year")) {
        data.year = doc.getAttribute("page-year");
    }

    if (doc.getAttribute("year")) {
        data.year = doc.getAttribute("year");
    }

    if (doc.getAttribute("page-link")) {
        data.link = doc.getAttribute("page-link");
    }

    if (doc.getAttribute("link")) {
        data.link = doc.getAttribute("link");
    }

    if (doc.getAttribute("page-image")) {
        data.image = doc.getAttribute("page-image");
    }

    if (doc.getAttribute("image")) {
        data.image = doc.getAttribute("image");
    }

    if (doc.getAttribute("image")) {
        data.image = doc.getAttribute("image");
    }

    if (doc.getAttribute("showtitle")) {
        data.showtitle = doc.getAttribute("showtitle");
    }

    return data;
}

export class AsciidoctorEngine implements Engine {
    includes?: string | undefined;

    render(content: string, data: AsciidocData): string | Promise<string> {
        return this.renderComponent(content, data);
    }

    renderComponent(_content: string, data: AsciidocData): string {
        if (!data.doc) {
            return "";
        }

        return data.doc.convert();
    }

    addHelper(): void {
    }

    deleteCache(): void {
    }
}
