interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
  dark = false,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "";
  const barAlign = align === "center" ? "mx-auto" : "";

  return (
    <div className={`mb-10 ${alignClass}`}>
      {label && (
        <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">
          {label}
        </p>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold leading-tight ${
          dark ? "text-white" : "text-dark"
        }`}
      >
        {title}
      </h2>
      <div
        className={`w-16 h-1 bg-accent mt-4 ${barAlign}`}
      />
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed max-w-2xl ${
            dark ? "text-grey-300" : "text-text-muted"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
