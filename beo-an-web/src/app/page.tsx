import HeroAssembly from "@/components/HeroAssembly";
import MenuGrid from "@/components/MenuGrid";
import ReservationForm from "@/components/ReservationForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroAssembly />
      <MenuGrid />
      <ReservationForm />
    </main>
  );
}
