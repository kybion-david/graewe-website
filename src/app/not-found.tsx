import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "#f5f5f5",
          color: "#1a1a1a",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6b6b6b",
                marginBottom: "0.75rem",
              }}
            >
              404
            </p>
            <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem" }}>
              Seite nicht gefunden
            </h1>
            <p style={{ color: "#6b6b6b", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
              Die angeforderte Seite existiert nicht oder wurde verschoben.
            </p>
            <Link
              href="/de"
              style={{
                display: "inline-block",
                background: "#ffd600",
                color: "#1a1a1a",
                fontWeight: 600,
                textDecoration: "none",
                padding: "0.75rem 1.25rem",
              }}
            >
              Zur Startseite
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
