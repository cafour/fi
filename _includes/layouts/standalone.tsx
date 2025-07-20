export const layout = "layouts/base.tsx";

export default function ({ children, title, showtitle }: Lume.Data) {
  return (
    <main>
      <article>
        {showtitle && <h1>{title}</h1>}
        {children}
      </article>
    </main>
  );
}
