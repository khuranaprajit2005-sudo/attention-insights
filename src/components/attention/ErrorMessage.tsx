export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground"
    >
      {message}
    </p>
  );
}
