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

export default ({ title, children, showtitle, course, tags, groups, search, home, page }: QuestionPageData) => {
  const githubLink = page.src.entry ? `https://github.com/cafour/fi/blob/main${page.src.entry.path}` : null;
  return (
    <>
      <nav class="nav">
        <a href={home} class="nav-header">
          <img src="/icons/fi.png" class="logo" />
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
        <header>
          {showtitle && <h1>{title}</h1>}
          {githubLink && (
            <a class="edit-link btn" href={githubLink} target="_blank">
              <img class="icon pixelart" src="/icons/edit_really_smol.png" />
              <span>Editovat</span>
            </a>
          )}
        </header>

        {children}

        <footer>
          {githubLink && (
            <div class="admonitionblock tip">
              <p>
                Vloudila se sem chyba? Něco ti tu chybí? Řekni mi to skrz{" "}
                <a href="https://github.com/cafour/fi/issues/" target="_blank">
                  issue na GitHubu
                </a>{" "}
                nebo to (ideálně){" "}
                <a href={githubLink} target="_blank">
                  uprav
                </a>{" "}
                a vytvoř pull request! Pokud nevíš jak na to,{" "}
                <a
                  href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request"
                  target="_blank"
                >
                  mrkni sem.
                </a>
              </p>
            </div>
          )}
        </footer>
      </main>
    </>
  );
};
