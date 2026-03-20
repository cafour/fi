import { NotePageData } from "../_includes/layouts/default.tsx";

export function url(page: Lume.Page<NotePageData>) {
    let slug = page.data.basename ?? "";
    const groups = page.data.groups?.map(g => g.name) ?? [];
    for (const group of groups) {
        const groupRegex = new RegExp(`^(${group})\\d*[-_]`);
        if (slug.match(groupRegex)) {
            slug = slug.replace(groupRegex, "");
            break;
        }
    }
    slug = slug.replaceAll("_", "-");
    if (slug === "index") {
        return "./";
    }

    return `./${slug}/`;
}
