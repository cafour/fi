import { Node as TocNode } from "lume_markdown_plugins/toc/mod.ts";
import { Finder } from "../../_plugins/finder.ts";
import { NavItem } from "../../_components/NavLevel.tsx";
import * as path from "@std/path";

export const layout = "layouts/base.tsx";

export interface NotePageData extends Lume.Data {
    course?: string;
    discriminator?: string;
    priority?: number;
    toc?: TocNode[];
    showtitle?: boolean;
    nav?: NavItem[];
    groups?: NotePageGroup[];
    finder: Finder;
}

export interface NotePageGroup {
    name: string;
    display: string;
}

export default function (
    {
        children,
        search,
        course,
        showtitle,
        title,
        comp,
        nav,
        finder,
        discriminator,
        groups,
    }: NotePageData,
) {
    let groupNav: NavItem[] = [];
    if (discriminator) {
        const pageGroups = Object.groupBy(
            search.pages(discriminator)
                .map((p) => {
                    const captures = path.basename(p.page.sourcePath).match(
                        /^(([A-Z]+)\d+)_/,
                    );
                    return {
                        group: captures?.[2] ?? null,
                        order: captures?.[1] ?? "",
                        page: p,
                    };
                })
                .filter((gp) => gp.group != null),
            (p) => p.group!,
        );

        groupNav = Object.entries(pageGroups).map<NavItem>(([group, children]) => {
            return {
                title: groups?.filter((g) => g.name == group)?.at(0)?.display ??
                    "Unnamed page group",
                children: children
                    ?.sort((a, b) => a.order!.localeCompare(b.order!))
                    ?.map<NavItem>((p) => {
                        return {
                            title: `${p.order}. ${p.page.title}`,
                            href: p.page.url,
                        };
                    }),
            };
        });
    }

    return (
        <>
            <nav>
                <div class="menu-bar">
                    <label for="sidebar-toggle">
                        <img src="/icons/left_panel_open_8.png" data-inline />
                    </label>
                </div>
                <input type="checkbox" id="sidebar-toggle" />
                <label id="darkness" for="sidebar-toggle"></label>
                <div class="sidebar">
                    <a class="logo" href="/">
                        {course ?? "Poznámky z FI"}
                    </a>
                    {/* <div id="search"></div> */}
                    <button class="btn flex flex-row">
                        <i class="icon icon-search"></i>
                        <span class="grow-1">Search...</span>
                        <kbd>Ctrl</kbd>
                        <kbd>K</kbd>
                    </button>
                    <comp.NavLevel
                        items={[...(nav ?? []), ...groupNav]}
                        finder={finder}
                    />
                    <div class="sidebar-links">
                        <a href="https://github.com/cafour/fi" class="btn" target="_blank">
                            <i class="icon icon-github"></i>
                        </a>
                        {/* <comp.Empty html={comp.ThemeToggle()} /> */}
                        {/* <div dangerouslySetInnerHTML={{ __html: comp.ThemeToggle() }}></div> */}
                    </div>
                </div>
            </nav>
            <main>
                <article>
                    {(showtitle === true || showtitle === undefined) && <h1>{title}</h1>}
                    {children}
                </article>
            </main>
        </>
    );
}
