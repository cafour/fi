import { Node as TocNode } from "lume_markdown_plugins/toc/mod.ts";

export const layout = "layouts/base.tsx";

interface NotePageData extends Lume.Data {
  section?: string;
  priority?: number;
  toc?: TocNode[];
}

export default ({ children, search, section }: NotePageData) => (
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
          <img src="/icons/fi_16.png" />
          {section ?? "Poznámky z FI"}
        </a>
        <div id="search"></div>
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
      </div>
    </nav>
    <main>
      <article>{children}</article>
    </main>
  </>
);
