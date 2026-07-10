import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapScrollAnimations(
  containerRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const scroller = containerRef.current;
    if (!scroller) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(".gsap-fade-in");
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, scroller);

    return () => ctx.revert();
  }, [containerRef]);
}
