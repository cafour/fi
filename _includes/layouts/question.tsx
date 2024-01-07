import * as path from "std/path/mod.ts";

export const layout = "layouts/base.tsx";

interface QuestionGroup {
  name: string;
  display: string;
}

interface QuestionPageData extends Lume.Data {
  course: string;
  groups: QuestionGroup[];
  home: string;
  group?: string;
  order?: string;
  showtitle: boolean;
}

export default ({
  title,
  children,
  showtitle,
  course,
  tags,
  groups,
  search,
  home,
}: QuestionPageData) => {
  return (
    <>
      <nav class="nav">
        <a href={home} class="nav-header">
          {course}
        </a>
        {groups.map((g) => (
          <div class="nav-group">
            <span class="nav-subheader">{g.display}</span>
            <ul>
              {(search.pages(`${tags}`, "order") as QuestionPageData[])
                .sort((a, b) => (a.order ?? "").localeCompare(b.order ?? ""))
                .filter((p) => p.group === g.name)
                .map((p) => (
                  <li>
                    <a href={p.url.toString()}>
                      {p!.order}. {p!.title}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {/* {#each $page.data.groups as group}
    <NavGroup name="{group.name}" links="{group.questions}" />
  {/each} */}
      </nav>
      <main>
        {showtitle && <h1>{title}</h1>}
        {children}
      </main>
    </>
  );
};
