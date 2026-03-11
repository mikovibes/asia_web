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
  const phoRef = useRef<HTMLDivElement>(null);
  const steamRefs = useRef<(HTMLDivElement | null)[]>([]);
  
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

    // Micro-parallax for the bowl itself
    const phoRotateXTo = gsap.quickTo(phoRef.current, "rotationX", { duration: 0.7, ease: "power3.out" });
    const phoRotateYTo = gsap.quickTo(phoRef.current, "rotationY", { duration: 0.7, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      // Use window innerWidth/innerHeight for global screen tracking
      const x = e.clientX / window.innerWidth; // 0 to 1
      const y = e.clientY / window.innerHeight; // 0 to 1

      // Map to -1 to 1 range
      const xOffset = (x - 0.5) * 2;
      const yOffset = (y - 0.5) * 2;

      // Make the logo "face" the cursor
      // If mouse is on right (xOffset > 0), rotateY should be negative to bring right side closer
      rotateYTo(-xOffset * 12);
      // If mouse is at bottom (yOffset > 0), rotateX should be positive to bring bottom side closer
      rotateXTo(yOffset * 12);
      
      // Slight positional shift towards the cursor
      translateXTo(xOffset * 15);
      translateYTo(yOffset * 15);

      // Micro-parallax for the bowl (very subtle tracking)
      phoRotateYTo(-xOffset * 5);
      phoRotateXTo(yOffset * 5);

      // Shadow parallax - shadow moves opposite to light source (subtle)
      shadowXTo(-xOffset * 40);
      shadowYTo(-yOffset * 40 + 200); // Base ground offset of +200px down
    };

    window.addEventListener("mousemove", handleMouseMove);

    const ctx = gsap.context(() => {
      // Set initial ground projection shadow state
      gsap.set(shadowRef.current, {
        scaleY: 0.6,
        filter: "blur(40px)",
        y: 200
      });

      // No float for phoRef.current - making it static as per user request

      // Entrance Sequence: Text rises out of the Pho bowl like steam
      const entranceTl = gsap.timeline({
        onComplete: () => {
          // Gentle continuous floating animation starts AFTER entrance is done
          gsap.to(logoRef.current, {
            y: "-=35",
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
          });

          // Shadow floating physics
          gsap.to(shadowRef.current, {
            y: "+=15",
            opacity: 0.15,
            scaleY: 0.5,
            scaleX: 0.9,
            filter: "blur(55px)",
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
          });
        }
      });

      entranceTl.fromTo(
        logoRef.current,
        { scale: 0, opacity: 0, y: 150, rotationZ: -5 },
        { scale: 1, opacity: 1, y: 0, rotationZ: 0, duration: 2, ease: "elastic.out(1, 0.7)" },
        0.5 // slight delay on load
      ).fromTo(
        shadowRef.current,
        { scaleX: 0, opacity: 0, y: 300 }, // Shadow starts very small and deep
        { scaleX: 1, opacity: 0.35, y: 200, duration: 2, ease: "elastic.out(1, 0.7)" },
        0.5
      );

      // Continuous steam particle loop
      steamRefs.current.forEach((steam, i) => {
        if (!steam) return;
        gsap.to(steam, {
          y: -400,
          x: `+=${(Math.random() - 0.5) * 100}`,
          opacity: 0,
          scale: 1.5,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          delay: i * 0.8,
          ease: "power1.out",
          onRepeat: () => {
            gsap.set(steam, { 
              y: 0, 
              x: (Math.random() - 0.5) * 150, 
              opacity: 0.6, 
              scale: 0.2 + Math.random() * 0.5 
            });
          }
        });
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

      // The 2.5D logo, Pho bowl, and shadow scale down and move up on scroll
      tl.to(
        [logoRef.current, shadowRef.current, phoRef.current],
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
      window.removeEventListener("mousemove", handleMouseMove);
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

      {/* 3D Pho Bowl & Steam System (Layered between background and main text) */}
      <div className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center w-full h-full perspective-[1000px] translate-y-[12vh] md:translate-y-[15vh]">
         {/* Steam Clouds */}
         <div className="absolute inset-0 flex items-center justify-center z-[18]">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                ref={(el) => { steamRefs.current[i] = el; }}
                className="absolute w-[80px] md:w-[120px] h-[80px] md:h-[120px] opacity-0"
              >
                <Image 
                  src="/steam_bria.png" 
                  alt="Steam" 
                  fill
                  className="object-contain brightness-110 contrast-75"
                />
              </div>
            ))}
         </div>

         <div 
           ref={phoRef}
           className="relative w-[60vw] md:w-[38vw] max-w-[600px] h-[30vh] md:h-[420px] translate-x-[3vw]"
           style={{ transformStyle: "preserve-3d" }}
         >
           <Image 
             src="/pho_soup_bria.png" 
             alt="Delicious Pho Soup" 
             fill
             className="object-contain drop-shadow-[0_45px_70px_rgba(255,165,0,0.5)]"
           />
         </div>
      </div>

      {/* 2.5D Interactive Image Logo Group */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center w-full h-full perspective-[1200px] -translate-y-[15vh] md:-translate-y-[20vh]">
         
         {/* Shadow Layer: A blurred duplicate of the logo perfectly matching its geometry */}
         <div 
           ref={shadowRef}
           className="absolute w-[95vw] md:w-[85vw] max-w-[1200px] h-[40vh] md:h-[600px]"
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
           className="relative w-[95vw] md:w-[85vw] max-w-[1200px] h-[40vh] md:h-[600px]"
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
