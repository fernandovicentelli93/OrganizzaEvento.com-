import Link from "next/link";

export function FloatingAskButton() {
  return (
    <Link
      href="/fai-domanda"
      className="focus-ring fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(203,78,124,0.28)] transition hover:bg-violet-hover sm:bottom-6 sm:right-6"
    >
      Fai una domanda
    </Link>
  );
}
