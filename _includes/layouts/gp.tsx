export default function ({ children }: Lume.Data) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <base target="_blank" />
      </head>

      <body>{children}</body>
    </html>
  );
}
