export const layout = "layouts/base.tsx";

export default ({ children, title, showtitle }: Lume.Data) => (
  <main>
    <article>
      {showtitle && <h1>{title}</h1>}
      {children}
    </article>
  </main>
);
