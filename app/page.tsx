import Feature from '@/components/Feature'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Testimonials from '@/components/Testimonials'
import TopPicks from '@/components/TopPicks'


export default function Home() {
  return (
    <main className="max-w-[1920px] m-auto">
      <Navbar />
      <Hero />
      <TopPicks />
      <Feature />
      <Testimonials />
      <Footer />
    </main>
  )
}
