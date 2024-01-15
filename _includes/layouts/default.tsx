import { Node as TocNode } from "lume_markdown_plugins/toc/mod.ts";
import Empty from "../../_components/Empty.ts";
import { Finder } from "../../_plugins/finder.ts";

export const layout = "layouts/base.tsx";

interface NavItem {
  title?: string;
  href?: string;
  display?: string;
}

interface NotePageData extends Lume.Data {
  course?: string;
  priority?: number;
  toc?: TocNode[];
  showtitle?: boolean;
  nav?: NavItem[];
  finder: Finder;
}

export default ({ children, search, course, showtitle, title, comp }: NotePageData) => (
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
        <ul>
          {(search.pages("doc", "order") as NotePageData[]).map((p) => (
            <li>
              <a href={p.url.toString()}>{p.title}</a>
              {p.toc && p.toc.length > 0 && (
                <ul>
                  {p.toc.map((n) => (
                    <li>
                      <a href={n.url}>{n.text}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div class="sidebar-links">
          <a href="https://github.com/cafour/fi" class="btn" target="_blank">
            <i class="icon icon-github"></i>
          </a>
          <comp.Empty html={comp.ThemeToggle()} />
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
