import Image from "next/image";
import Link from "next/link";
import { VIBES_PLANNER_URL } from "@/lib/constants";

type VibesPlannerBannerProps = {
  variant?: "horizontal" | "square" | "footer";
  className?: string;
};

const images = {
  horizontal: {
    src: "/partners/vibes-planner/banner-header.jpg",
    width: 1200,
    height: 180,
    alt: "Vibes Planner - fatti trovare da nuovi clienti"
  },
  square: {
    src: "/partners/vibes-planner/banner-square.jpg",
    width: 395,
    height: 395,
    alt: "Vibes Planner - il tuo matrimonio inizia da qui"
  },
  footer: {
    src: "/partners/vibes-planner/banner-footer.jpg",
    width: 650,
    height: 236,
    alt: "Vibes Planner - smetti di cercare clienti"
  }
};

export function VibesPlannerBanner({ variant = "horizontal", className = "" }: VibesPlannerBannerProps) {
  const image = images[variant];
  const wrapperSize =
    variant === "square"
      ? "max-w-[14rem]"
      : variant === "footer"
        ? "mx-auto max-w-[650px]"
        : "mx-auto max-w-4xl";
  const imageClassName =
    variant === "square"
      ? "aspect-square h-auto w-full object-cover"
      : variant === "footer"
        ? "h-auto max-h-[11rem] w-full object-cover"
        : "h-auto max-h-[9rem] w-full object-cover";

  return (
    <aside className={`${className} ${wrapperSize}`} aria-label="Collaborazione Vibes Planner">
      <Link
        href={VIBES_PLANNER_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="focus-ring group block overflow-hidden rounded-lg border border-line bg-white p-1.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={variant === "square" ? "224px" : variant === "footer" ? "(max-width: 768px) 92vw, 650px" : "(max-width: 768px) 92vw, 896px"}
          className={`rounded-md ${imageClassName}`}
        />
        <span className="sr-only">Apri Vibes Planner</span>
      </Link>
    </aside>
  );
}
