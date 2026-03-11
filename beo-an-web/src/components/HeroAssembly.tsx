"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function HeroAssembly() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  
  const floatingImagesRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !shadowRef.current) return;
    
    // QuickSetters for hyper-smooth parallax
    const rotateXTo = gsap.quickTo(logoRef.current, "rotationX", { duration: 0.6, ease: "power3.out" });
    const rotateYTo = gsap.quickTo(logoRef.current, "rotationY", { duration: 0.6, ease: "power3.out" });
    const translateXTo = gsap.quickTo(logoRef.current, "x", { duration: 0.6, ease: "power3.out" });
    const translateYTo = gsap.quickTo(logoRef.current, "y", { duration: 0.6, ease: "power3.out" });

    const shadowXTo = gsap.quickTo(shadowRef.current, "x", { duration: 0.8, ease: "power3.out" });
    const shadowYTo = gsap.quickTo(shadowRef.current, "y", { duration: 0.8, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1

      // Map to -1 to 1 range
      const xOffset = (x - 0.5) * 2;
      const yOffset = (y - 0.5) * 2;

      // Make the logo "face" the cursor
      // If mouse is on right (xOffset > 0), rotateY should be negative to bring right side closer
      rotateYTo(-xOffset * 25);
      // If mouse is at bottom (yOffset > 0), rotateX should be positive to bring bottom side closer
      rotateXTo(yOffset * 25);
      
      // Slight positional shift towards the cursor
      translateXTo(xOffset * 30);
      translateYTo(yOffset * 30);

      // Shadow moves away from the cursor (parallax effect)
      shadowXTo(-xOffset * 60);
      shadowYTo(-yOffset * 60 + 40); // Base shadow offset of +40px downwards
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);

    const ctx = gsap.context(() => {
      // Gentle continuous floating animation
      gsap.to(logoRef.current, {
        y: "-=25",
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

      // Shadow scales and diffuses as the object "floats" higher
      gsap.to(shadowRef.current, {
        y: "+=15",
        opacity: 0.25,
        scale: 0.95,
        filter: "blur(35px)",
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
        },
      });

      // Extreme spread for the cramming animation
      floatingImagesRefs.current.forEach((img, i) => {
        if (!img) return;
        tl.fromTo(
          img,
          { 
            x: (i % 2 === 0 ? -1 : 1) * (1500 + Math.random() * 1000), 
            y: (Math.random() > 0.5 ? -1 : 1) * (1500 + Math.random() * 1000),
            rotation: Math.random() * 720,
            scale: 0.2,
            opacity: 0
          },
          { 
            x: 0, 
            y: 0, 
            rotation: 0, 
            scale: 1, 
            opacity: 1,
            ease: "power4.out" 
          },
          0
        );
      });

      // The 2.5D logo and shadow scale down and move up on scroll
      tl.to(
        [logoRef.current, shadowRef.current],
        { scale: 0.5, y: -300, ease: "power2.inOut" },
        0
      );

      // Welcome text fades in
      tl.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.8, y: 150 },
        { opacity: 1, scale: 1, y: 50, ease: "back.out(1.7)" },
        0.3
      );

    }, containerRef);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-beo-yellow flex flex-col items-center justify-center -z-10" style={{ perspective: "1000px" }}>
      
      {/* Absolute positioning for the animated food items (Cramming animation) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        {[1, 2, 3, 4, 5, 6].map((num, i) => (
          <div 
            key={num} 
            ref={(el) => { floatingImagesRefs.current[i] = el; }} 
            className="absolute box-cartoon overflow-hidden shadow-2xl"
            style={{
              width: `${200 + Math.random() * 150}px`,
              height: `${200 + Math.random() * 150}px`,
              marginLeft: `${(Math.random() - 0.5) * 800}px`,
              marginTop: `${(Math.random() - 0.5) * 800}px`,
              zIndex: 10 + i,
              borderRadius: i % 2 === 0 ? '2rem' : '50%'
            }}
          >
            <Image 
              src={`/food/food_${num}.avif`} 
              alt="Food" 
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* 2.5D Interactive Image Logo Group */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center w-full h-full perspective-[1200px]">
         
         {/* Shadow Layer: A blurred duplicate of the logo perfectly matching its geometry */}
         <div 
           ref={shadowRef}
           className="absolute w-[90vw] md:w-[70vw] max-w-[1000px] h-[30vh] md:h-[500px] opacity-40 blur-2xl"
         >
           <Image 
             src="/hero_3d_text_bria.png" 
             alt="Logo Shadow" 
             fill
             className="object-contain brightness-0"
             priority
           />
         </div>

         {/* Foreground Logo Layer */}
         <div 
           ref={logoRef} 
           className="relative w-[90vw] md:w-[70vw] max-w-[1000px] h-[30vh] md:h-[500px]"
           style={{ transformStyle: "preserve-3d" }}
         >
           <Image 
             src="/hero_3d_text_bria.png" 
             alt="Béo Ăn 3D Logo" 
             fill
             className="object-contain"
             priority
           />
         </div>
      </div>

      <h1 
        ref={textRef} 
        className="text-cartoon text-6xl md:text-8xl font-black mt-[40vh] z-30 text-center tracking-tighter"
      >
        Autentické Bistro
      </h1>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse z-30 pointer-events-none">
        <span className="font-nunito font-black text-beo-black uppercase tracking-[0.3em] text-xs mb-4">Prozkoumat Chutě</span>
        <div className="w-[2px] h-12 bg-beo-black/30 overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-1/2 bg-beo-black animate-[scrolldown_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
      
    </div>
  );
}
