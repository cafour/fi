
export class Finder {
    #site: Lume.Site;

    constructor(site: Lume.Site) {
        this.#site = site;
    }

    find(src: string): Lume.Page | null {
        const res = this.#site.pages.filter(p => p.sourcePath == src);
        return res[0] ?? null;
    }
}

export default function () {
    return (site: Lume.Site) => {
        site.data("finder", new Finder(site));
    }
}
