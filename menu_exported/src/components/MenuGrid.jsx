import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import menuData from "../data/menu_data.json";

gsap.registerPlugin(ScrollTrigger);

export default function MenuGrid() {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const lineRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal entire sections
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        gsap.fromTo(
          section,
          { opacity: 0, y: 150 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            },
          }
        );
      });

      // Expand horizontal lines
      lineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "circ.inOut",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
            },
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#FAFAFA] text-beo-black py-32 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        
        <div className="flex justify-between items-end mb-32">
          <h2 className="font-nunito font-black text-8xl md:text-[12rem] leading-none tracking-tighter uppercase relative z-10">Menu</h2>
          <div className="hidden lg:flex space-x-4 mb-4 relative z-10">
            <span className="flex items-center text-sm font-bold uppercase tracking-widest"><span className="text-xl mr-2">★</span> Signature</span>
            <span className="flex items-center text-sm font-bold uppercase tracking-widest text-red-600"><span className="text-xl mr-2">🌶</span> Spicy</span>
            <span className="flex items-center text-sm font-bold uppercase tracking-widest text-green-600"><span className="text-xl mr-2">🍃</span> Veg</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-32">
          {menuData.map((category, idx) => (
            <div 
              key={idx} 
              ref={(el) => { sectionsRef.current[idx] = el; }}
              className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-12 z-10"
            >
              <div className="lg:col-span-4 sticky top-10 self-start z-10">
                <h3 className="text-cartoon text-6xl md:text-8xl mb-4 text-beo-blue drop-shadow-[3px_3px_0_rgba(17,24,39,1)] break-words">
                  {category.category}
                </h3>
                {category.description && (
                  <p className="font-nunito text-2xl font-black italic tracking-tight text-gray-500 max-w-xs leading-snug">
                    "{category.description}"
                  </p>
                )}
              </div>

              <div className="lg:col-span-8 flex flex-col pt-4 z-10">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="mb-12 group cursor-crosshair">
                    <hr ref={(el) => { lineRefs.current[idx * 100 + itemIdx] = el; }} className="border-t-4 border-beo-black mb-8 w-full" />
                    
                    <div className="flex justify-between items-start gap-8">
                      <h4 className="font-nunito font-black text-4xl md:text-5xl uppercase tracking-tighter group-hover:text-beo-blue transition-colors duration-300">
                        {item.name}
                      </h4>
                      
                      <div className="flex space-x-3 shrink-0 pt-2">
                        {item.tags?.includes('signature') && <span className="text-3xl" title="Signature">★</span>}
                        {item.tags?.includes('spicy') && <span className="text-3xl text-red-600 drop-shadow-md" title="Spicy">🌶</span>}
                        {item.tags?.includes('vegetarian') && <span className="text-3xl text-green-600 drop-shadow-md" title="Vegetarian">🍃</span>}
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="font-nunito text-2xl font-bold text-gray-500 mt-4 max-w-2xl leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
