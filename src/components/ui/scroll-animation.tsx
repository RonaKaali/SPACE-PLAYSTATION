"use client";

import { useInView } from "react-intersection-observer";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollAnimation({
  children,
  className,
}: ScrollAnimationProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      {children}
    </div>
  );
}
