import { Node as TocNode } from "lume_markdown_plugins/toc/mod.ts";
import { Finder } from "../../_plugins/finder.ts";
import { NavItem } from "../../_components/NavLevel.tsx";

export const layout = "layouts/base.tsx";

interface NotePageData extends Lume.Data {
  course?: string;
  priority?: number;
  toc?: TocNode[];
  showtitle?: boolean;
  nav?: NavItem[];
  finder: Finder;
}

export default ({ children, search, course, showtitle, title, comp, nav, finder }: NotePageData) => (
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
        <comp.NavLevel items={nav} finder={finder} />
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
