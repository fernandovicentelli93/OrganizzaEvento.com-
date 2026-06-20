"use client";

import { useEffect, useState } from "react";

const eventImages = [
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=760&q=76",
    alt: "Matrimonio all'aperto con invitati e palloncini",
    label: "Matrimoni"
  },
  {
    src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=760&q=76",
    alt: "Festa privata con brindisi e luci calde",
    label: "Feste private"
  },
  {
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=760&q=76",
    alt: "Sala preparata per evento aziendale",
    label: "Eventi aziendali"
  }
];

export function RotatingEventImage() {
  const [imageIndex, setImageIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setImageIndex(Math.floor(Math.random() * eventImages.length));
    setReady(true);
  }, []);

  const image = eventImages[imageIndex];

  return (
    <div className="relative min-h-44 overflow-hidden rounded-lg border border-white bg-white shadow-sm">
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.02),rgba(47,36,48,0.58))]" />
      <div className="absolute bottom-3 left-3 right-3 rounded-md bg-white/95 px-3 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur">
        Ora si parla anche di {image.label.toLowerCase()}
      </div>
    </div>
  );
}
