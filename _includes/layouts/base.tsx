export interface FrontPageData extends Lume.Data {
  styles?: string[];
  math?: boolean;
}

export default ({ title, children, styles, math }: FrontPageData) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/icons/favicon.png" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title ? `${title} | FI Notes` : "FI Notes"}</title>
        {(styles ?? []).map((style) => (
          <link href={`/styles/${style}.css`} rel="stylesheet" />
        ))}
        <link href="/katex.css" rel="stylesheet" />
      </head>

      <body className={styles?.join(" ")}>{children}</body>
    </html>
  );
};
