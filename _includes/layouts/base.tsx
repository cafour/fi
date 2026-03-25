export interface FrontPageData extends Lume.Data {
  styles?: string[];
  useNewStyle?: boolean;
}

export default function (
  { title, children, styles, useNewStyle }: FrontPageData,
) {
  return (
    // dark theme is not ready yet
    <html data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" sizes="16x16" href="/icons/fi_16.ico" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#faf2eb"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#3a322b"
        />
        <title>{title ? `${title} | Poznámky z FI` : "Poznámky z FI"}</title>

        {!useNewStyle &&
          (styles ?? []).map((style) => (
            <link href={`/styles/${style}.css`} rel="stylesheet" />
          ))}
        {useNewStyle && <link href="/styles/main.css" rel="stylesheet" />}

        <link href="/katex.css" rel="stylesheet" />
        <script type="text/javascript" src="/scripts/main.js" />
        <script defer src="https://stats.mlejnek.cafour.cz/do.js" data-website-id="5f5e5531-ab6e-47bb-a570-c1ed6d8ebdb3"></script>
      </head>

      <body className={styles?.join(" ")}>{children}</body>
    </html>
  );
}
