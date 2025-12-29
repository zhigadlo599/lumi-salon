"use client";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionProps } from "@/lib/header";
import { getTestimonials } from "@/lib/testimonials";
import { TestimonialCard } from "@/app/components/TestimonialCard";
import { AnimationWrapper } from "@/app/components/AnimationWrapper";
import { useState } from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { SliderVariants } from "@/app/variants";

export const Testimonial = ({ messages }: SectionProps) => {
  const testimonials = getTestimonials(messages);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(1);

  // Responsive page size
  const pageSize = isMobile ? 1 : 2;
  const totalPages = Math.ceil(testimonials.length / pageSize);

  // Slice testimonials for current page
  const currentTestimonials = testimonials.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  // Navigation handlers
  const nextPage = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  const prevPage = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  const goToPage = (i: number) => {
    setDirection(i > currentPage ? 1 : -1);
    setCurrentPage(i);
  };

  // Media query for mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <section
      className="center relative z-10  w-full px-4 2xl:px-8 py-20"
      aria-labelledby="testimonials-heading"
    >
      <AnimationWrapper as={motion.header} className="w-full text-center">
        <h2
          id="testimonials-heading"
          className="  text-3xl font-bold text-[var(--primary-4)]"
        >
          {messages["testimonials.title"]}
        </h2>
        <p>{messages["testimonials.subtitle"]}</p>
        {/* Controls */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            aria-label="Previous testimonials"
            className="center rounded-full w-10 h-9 md:w-12 md:h-12 border border-[var(--primary-4)] bg-[var(--primary-1)] hover:bg-[var(--neutral-6)] hover:text-[var(--text-on-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--info)]"
            onClick={prevPage}
          >
            <ArrowBackIos className="ml-2 " />
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            className="center rounded-full w-10 h-10 md:w-12 md:h-12 border border-[var(--primary-4)] bg-[var(--primary-1)] hover:bg-[var(--neutral-6)] hover:text-[var(--text-on-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--info)]"
            onClick={nextPage}
          >
            <ArrowForwardIos />
          </button>
        </div>

        {/* Cards for current page */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={SliderVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`grid gap-8 mt-5 ${
              isMobile ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {currentTestimonials.map((testimonial, idx) => (
              <TestimonialCard
                testimonial={testimonial}
                index={currentPage * pageSize + idx}
                key={testimonial.name + idx}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dot navigation */}
        <nav
          className="mt-8 flex justify-center gap-2"
          aria-label="Testimonial navigation"
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`h-4 w-4 rounded-full border-2 border-[var(--primary-4)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--info)] ${
                currentPage === i ? "bg-[var(--primary-4)]" : "bg-transparent"
              }`}
              aria-label={`Go to testimonials page ${i + 1}`}
              aria-current={currentPage === i ? "true" : undefined}
              tabIndex={0}
              onClick={() => goToPage(i)}
            />
          ))}
        </nav>
      </AnimationWrapper>
    </section>
  );
};
