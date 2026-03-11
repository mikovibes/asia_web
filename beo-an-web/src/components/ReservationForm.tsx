"use client";

import { useState } from "react";
import Image from "next/image";

export default function ReservationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="w-full bg-beo-yellow py-32 flex justify-center items-center relative overflow-hidden">
      
      {/* Decorative Bowl Image */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-50 pointer-events-none translate-y-16 -translate-x-16 rotate-12">
        <Image src="/brand_assets.png" alt="Bowl" fill className="object-cover" />
      </div>

      <div className="box-cartoon w-full max-w-lg bg-white p-10 z-10 relative">
        {status === "success" ? (
          <div className="text-center py-10 animate-pulse">
            <h2 className="text-cartoon text-5xl text-blue-500 mb-4 drop-shadow-[3px_3px_0_rgba(17,24,39,1)]">Hotovo!</h2>
            <p className="text-2xl font-bold">Stůl je zarezervován.</p>
            <p className="text-gray-600 font-bold mt-2">Dostali jste potvrzení na email.</p>
          </div>
        ) : (
          <>
            <h2 className="text-cartoon text-5xl text-center mb-10 drop-shadow-[3px_3px_0_rgba(17,24,39,1)]">
              Rezervace
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              
              <div className="flex flex-col">
                <label className="font-extrabold text-xl mb-2">Jméno</label>
                <input 
                  required
                  type="text" 
                  placeholder="Váše Jméno"
                  className="p-4 rounded-xl border-4 border-black font-bold text-lg focus:outline-none focus:ring-4 focus:ring-beo-blue transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-extrabold text-xl mb-2">Čas</label>
                <input 
                  required
                  type="datetime-local" 
                  className="p-4 rounded-xl border-4 border-black font-bold text-lg focus:outline-none focus:ring-4 focus:ring-beo-blue transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-extrabold text-xl mb-2">Telefon</label>
                <input 
                  required
                  type="tel" 
                  placeholder="+420 123 456 789"
                  className="p-4 rounded-xl border-4 border-black font-bold text-lg focus:outline-none focus:ring-4 focus:ring-beo-blue transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={status === "submitting"}
                className={`text-cartoon text-2xl text-white py-4 rounded-xl border-4 border-black mt-4 transition-transform ${status === "submitting" ? "bg-gray-400" : "bg-beo-blue hover:-translate-y-1 hover:shadow-[0_4px_0_0_#111827]"} drop-shadow-[2px_2px_0_rgba(17,24,39,1)]`}
              >
                {status === "submitting" ? "odesílání..." : "Zarezervovat"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
