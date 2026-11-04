"use client";

import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/constants";

/**
 * Image for dynamic (user-provided) URLs. Falls back to a branded
 * placeholder if the URL is missing or fails to load.
 */
export default function SmartImage({
  src,
  alt = "",
  className,
  priority = false,
  ...rest
}) {
  const [current, setCurrent] = useState(src || FALLBACK_IMAGE);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        if (current !== FALLBACK_IMAGE) setCurrent(FALLBACK_IMAGE);
      }}
      {...rest}
    />
  );
}
