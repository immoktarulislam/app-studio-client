"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import SmartImage from "./SmartImage";
import { HERO_SLIDES } from "@/lib/constants";

/** Interactive hero slideshow (Swiper.js) with real studio visuals + CTAs. */
export default function HeroSlider() {
  return (
    <section className="relative h-[540px] w-full sm:h-[580px] lg:h-[640px]">
      <Swiper
        modules={[Autoplay, Pagination, Keyboard]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        loop
        className="h-full w-full"
        style={{ "--swiper-pagination-color": "var(--sp-brand)" }}
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className="relative h-full w-full">
              <SmartImage
                src={slide.image}
                alt={slide.title}
                priority
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <span className="badge badge-solid mb-4">
                      {slide.kicker}
                    </span>
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                      {slide.text}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href={slide.primary.href}
                        className="btn btn-primary btn-lg"
                      >
                        {slide.primary.label}
                      </Link>
                      <Link
                        href={slide.secondary.href}
                        className="btn btn-lg border border-white/40 bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
                      >
                        {slide.secondary.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
