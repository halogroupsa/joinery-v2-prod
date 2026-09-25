"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { imageMeta, folderImages, srcsetFor } from "@/lib/images";

// Re-export server-safe helpers for existing import sites.
export { imageMeta, folderImages } from "@/lib/images";

export interface SmartImageProps {
  folder: string;
  base: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  ratio?: string;
  loading?: "eager" | "lazy";
}

export function SmartImage({
  folder,
  base,
  alt,
  className,
  sizes = "(min-width: 1280px) 1200px, (min-width: 768px) 80vw, 100vw",
  priority = false,
  ratio,
  loading,
}: SmartImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { srcset, fallback } = srcsetFor(folder, base);
  const meta = imageMeta(folder, base);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={cn("c-smart-image img-card", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <img
        ref={ref}
        src={fallback}
        srcSet={srcset}
        sizes={sizes}
        width={meta?.width}
        height={meta?.height}
        alt={alt}
        loading={loading ?? (priority ? "eager" : "lazy")}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "img-fade-in absolute inset-0 h-full w-full object-cover",
          loaded && "is-loaded",
        )}
      />
    </div>
  );
}
