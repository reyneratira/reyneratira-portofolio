import { Navbar, Hero, Skills, Projects, Terminal, Contact, Footer } from './components'

/**
 * App — Root layout assembling all portfolio sections.
 * Uses the design system's container-max width with margin-x gutters.
 * Sections are spaced with stack-lg (120px) vertical rhythm.
 */
export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex flex-col gap-20 pb-20 max-w-[1280px] mx-auto px-6 md:px-16 w-full pt-24">
        <Hero />
        <Skills />
        <Projects />
        <Terminal />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
