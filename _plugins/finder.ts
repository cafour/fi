import * as path from "std/path/posix/mod.ts";
export class Finder {
    #site: Lume.Site;
    #currentPage: Lume.Page;

    constructor(site: Lume.Site, currentPage: Lume.Page) {
        this.#site = site;
        this.#currentPage = currentPage;
    }

    find(src: string): Lume.Page | null {
        if (src.startsWith(".") || !src.startsWith("/")) {
            src = path.join(path.dirname(this.#currentPage.src.path), src);
        }
        const res = this.#site.pages.filter(p => p.sourcePath == src);
        return res[0] ?? null;
    }
}

export default function () {
    return (site: Lume.Site) => {
        site.preprocess("*", (pages) => {
            for (const page of pages) {
                page.data["finder"] = new Finder(site, page);
            }
        });
    }
}
