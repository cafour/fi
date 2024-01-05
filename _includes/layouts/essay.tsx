export const layout = "layouts/top.tsx";

export const tags: string[] = ["essay"];

export default ({ title, children }: Lume.Data) => (
  <>
    <header>
      <h1>{title}</h1>
    </header>
    <main>
      <section>
        {children}
      </section>
    </main>
  </>
);
