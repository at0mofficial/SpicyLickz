import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import TopPicks from "@/components/TopPicks";

export default function Home() {
  return (
    <main>
      <Hero />
      <TopPicks />
      <Feature />
      <Testimonials />
    </main>
  );
}
