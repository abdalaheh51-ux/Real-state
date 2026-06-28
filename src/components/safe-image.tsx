"use client";

import { useState, type ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  fallbackGradient?: string;
  fallbackIcon?: ReactNode;
};

export function SafeImage({
  src,
  alt,
  className,
  fallbackGradient = "from-emerald-600 via-teal-700 to-emerald-900",
  fallbackIcon,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
          fallbackGradient,
          className
        )}
        role="img"
        aria-label={alt}
      >
        {fallbackIcon ?? <Building2 className="size-12 text-white/40" />}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
