export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`brand ${dark ? "brand-dark" : ""}`}>
      <img src="/assets/detelgy-logo.png" alt="Detelgy" />
    </span>
  );
}
