import { Finder } from "../_plugins/finder.ts";

export interface NavItem {
    title?: string;
    href?: string;
    children?: NavItem[];
}

export default function NavLevel({
    items,
    depth,
    maxDepth,
    finder,
}: {
    items?: NavItem[];
    depth?: number;
    maxDepth?: number;
    finder: Finder;
}) {
    if (items === null || items === undefined) {
        return <></>;
    }

    if (items.length === 0) {
        return <ul></ul>;
    }

    depth ??= 0;
    if (maxDepth && depth > maxDepth) {
        return <></>;
    }
    return (
        <ul class="nav-level w-full">
            {items.map((i) => (
                <li class="nav-item w-full">
                    {i.href
                        ? (
                            <a class="nav-link block text-ellipsis whitespace-nowrap overflow-hidden" href={i.href}>
                                {i.title ?? finder.find(i.href)?.data.title ?? "Missing"}
                            </a>
                        )
                        : (
                            <span class="nav-link block text-ellipsis whitespace-nowrap overflow-hidden">
                                {i.title ?? "Missing"}
                            </span>
                        )}
                    {i.children && i.children.length > 0 && (
                        <NavLevel items={i.children} depth={depth! + 1} maxDepth={maxDepth} finder={finder} />
                    )}
                </li>
            ))}
        </ul>
    );
}
