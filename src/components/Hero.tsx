/**
 * Hero Section — Full viewport intro with massive H1 headline,
 * two CTA buttons (primary solid, secondary ghost), and staggered fade-in.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="flex flex-col gap-8 justify-center min-h-[500px] pt-8"
    >
      <h1
        className="text-h1 text-on-surface max-w-5xl animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        BUILDING THE FUTURE OF THE WEB.
      </h1>

      <p
        className="text-body-lg text-on-surface-variant max-w-3xl animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        I craft high-performance, precision-engineered web experiences.
        Specializing in brutalist aesthetics and modern technical stacks.
      </p>

      <div
        className="flex flex-wrap gap-4 mt-8 animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        <a
          href="#work"
          className="bg-primary-container text-on-primary-container text-label-caps px-8 py-4 border-none hover:bg-primary-fixed transition-colors duration-200 inline-block"
          id="cta-view-projects"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="bg-transparent text-on-surface text-label-caps px-8 py-4 border-2 border-outline hover:border-primary-container transition-colors duration-200 inline-block"
          id="cta-contact"
        >
          Contact Me
        </a>
      </div>
    </section>
  )
}
