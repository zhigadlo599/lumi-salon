"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LightboxProps } from "../types/gallery";
import { SliderVariants } from "@/app/variants";
import { Add, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  messages,
}) => {
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (currentIndex > 0) {
            setDirection(-1);
            onNavigate(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentIndex < images.length - 1) {
            setDirection(1);
            onNavigate(currentIndex + 1);
          }
          break;
      }
    },
    [isOpen, currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();

      document.body.style.overflow = "hidden";

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const imageCountText = messages.imageOf
    .replace("{current}", String(currentIndex + 1))
    .replace("{total}", String(images.length));

  return (
    <AnimatePresence>
      <motion.div
        ref={lightboxRef}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={messages.close}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label={messages.close}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image counter */}
        <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
          {imageCountText}
        </div>

        {/* Zoom / Add button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((z) => !z);
          }}
          className="absolute right-16 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-pressed={zoomed}
          aria-label={zoomed ? "Exit zoom" : "Zoom image"}
          title={zoomed ? "Exit zoom" : "Zoom image"}
        >
          <Add />
        </button>

        {/* Main image container */}
        <div
          className="relative flex h-full w-full max-w-5xl flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation buttons */}
          <button
            onClick={() => {
              setDirection(-1);
              onNavigate(currentIndex - 1);
            }}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/30 p-3 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={messages.previous}
          >
            <ArrowBackIos className="ml-2" />
          </button>

          <button
            onClick={() => {
              setDirection(1);
              onNavigate(currentIndex + 1);
            }}
            disabled={currentIndex === images.length - 1}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={messages.next}
          >
            <ArrowForwardIos />
          </button>

          {/* Main image */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={SliderVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={`relative ${zoomed ? "h-[90vh]" : "h-[60vh]"} w-full`}
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Thumbnails */}
          <div className="mt-4 flex max-w-full gap-2 overflow-x-auto px-4 pb-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  onNavigate(index);
                }}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  index === currentIndex
                    ? "ring-2 ring-amber-500 opacity-100"
                    : "opacity-50 hover:opacity-100"
                }`}
                aria-label={`View ${image.alt}`}
                aria-current={index === currentIndex ? "true" : "false"}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
