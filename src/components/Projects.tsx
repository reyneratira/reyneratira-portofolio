import { useInView } from '../hooks'

interface Project {
  title: string
  description: string
  tags: string[]
}

const projects: Project[] = [
  {
    title: 'ADA Attendance',
    description:
      'A B2B SaaS for attendance tracking and management for a local barbershop franchise.',
    tags: ['Next.js', 'Express.js', 'Flutter', 'Prisma', 'Supabase'],
  }
]

/**
 * Projects Section — "Selected Works" showcase.
 * Cards use surface-container-lowest bg with 1px border,
 * transitioning to primary-container on hover per DESIGN.md.
 */
export default function Projects() {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section
      id="work"
      ref={ref as React.RefObject<HTMLElement>}
      className="flex flex-col gap-12 border-t border-surface-variant pt-16"
    >
      <h2
        className={`text-h2 text-on-surface transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        Selected Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <div
            key={project.title}
            className={`group relative border border-surface-variant bg-surface-container-lowest overflow-hidden flex flex-col h-full hover:border-primary-container transition-all duration-500 cursor-pointer ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: `${(i + 1) * 200}ms` }}
            id={`project-card-${i}`}
          >
            <div className="p-8 flex flex-col flex-grow gap-4">
              <h3 className="text-h3 text-on-surface group-hover:text-primary-fixed transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-body-md text-on-surface-variant flex-grow">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-variant text-on-surface text-label-caps px-2 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
