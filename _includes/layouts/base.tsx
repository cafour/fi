export interface FrontPageData extends Lume.Data {
  styles?: string[];
  math?: boolean;
}

export default ({ title, children, styles, math }: FrontPageData) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" sizes="16x16" href="/icons/fi_16.ico" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#faf2eb" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#3a322b" />
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
